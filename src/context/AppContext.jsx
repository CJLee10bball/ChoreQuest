import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { LEVEL_THRESHOLDS } from '../data/preloadedChores';

const AppContext = createContext(null);

// ─── Helpers ───────────────────────────────────────────────────────────────

export function getLevelInfo(totalXp) {
  let current = LEVEL_THRESHOLDS[0];
  let next = LEVEL_THRESHOLDS[1];
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (totalXp >= LEVEL_THRESHOLDS[i].xpRequired) {
      current = LEVEL_THRESHOLDS[i];
      next = LEVEL_THRESHOLDS[i + 1] || null;
      break;
    }
  }
  const xpIntoLevel = totalXp - current.xpRequired;
  const xpForNext   = next ? next.xpRequired - current.xpRequired : 1;
  const progress    = next ? Math.min((xpIntoLevel / xpForNext) * 100, 100) : 100;
  return { current, next, xpIntoLevel, xpForNext, progress };
}

function generateFamilyCode() {
  const words = ['DRAGON','CASTLE','KNIGHT','SWORD','SHIELD','QUEST','REALM','CROWN'];
  return words[Math.floor(Math.random() * words.length)] +
         Math.floor(1000 + Math.random() * 9000);
}

// ─── Initial State ─────────────────────────────────────────────────────────

const INITIAL_STATE = {
  families: {},      // { [familyCode]: familyObj }
  currentFamily: null,
  currentView: 'landing',  // landing | parent | kid
  currentKidId: null,
};

// ─── Reducer ───────────────────────────────────────────────────────────────

function reducer(state, action) {
  switch (action.type) {

    case 'CREATE_FAMILY': {
      const code = generateFamilyCode();
      const family = {
        code,
        name: action.name,
        parentPin: action.pin,
        kids: [],
        chores: [],
        rewards: [],
        pendingCompletions: [],
      };
      return {
        ...state,
        families: { ...state.families, [code]: family },
        currentFamily: code,
        currentView: 'parent',
      };
    }

    case 'JOIN_FAMILY': {
      return {
        ...state,
        currentFamily: action.code,
        currentView: 'landing',
      };
    }

    case 'SET_VIEW': {
      return { ...state, currentView: action.view, currentKidId: action.kidId ?? state.currentKidId };
    }

    case 'ADD_KID': {
      const family = state.families[state.currentFamily];
      const kid = {
        id: uuidv4(),
        name: action.name,
        avatar: action.avatar,
        coins: 0,
        totalCoinsEarned: 0,
        xp: 0,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: { ...family, kids: [...family.kids, kid] },
        },
      };
    }

    case 'REMOVE_KID': {
      const family = state.families[state.currentFamily];
      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: {
            ...family,
            kids: family.kids.filter(k => k.id !== action.kidId),
          },
        },
      };
    }

    case 'ADD_CHORE': {
      const family = state.families[state.currentFamily];
      const chore = {
        id: uuidv4(),
        name: action.name,
        description: action.description,
        icon: action.icon || '📋',
        tier: action.tier,
        coins: action.coins,
        xp: action.xp,
        assignedTo: action.assignedTo || [],
        isRecurring: action.isRecurring ?? true,
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: { ...family, chores: [...family.chores, chore] },
        },
      };
    }

    case 'REMOVE_CHORE': {
      const family = state.families[state.currentFamily];
      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: {
            ...family,
            chores: family.chores.filter(c => c.id !== action.choreId),
            pendingCompletions: family.pendingCompletions.filter(p => p.choreId !== action.choreId),
          },
        },
      };
    }

    case 'UPDATE_CHORE': {
      const family = state.families[state.currentFamily];
      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: {
            ...family,
            chores: family.chores.map(c =>
              c.id === action.choreId ? { ...c, ...action.updates } : c
            ),
          },
        },
      };
    }

    case 'ADD_REWARD': {
      const family = state.families[state.currentFamily];
      const reward = {
        id: uuidv4(),
        name: action.name,
        description: action.description,
        cost: action.cost,
        icon: action.icon || '🎁',
        createdAt: new Date().toISOString(),
      };
      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: { ...family, rewards: [...family.rewards, reward] },
        },
      };
    }

    case 'REMOVE_REWARD': {
      const family = state.families[state.currentFamily];
      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: {
            ...family,
            rewards: family.rewards.filter(r => r.id !== action.rewardId),
          },
        },
      };
    }

    case 'SUBMIT_COMPLETION': {
      // Kid marks chore done (photo optional). Coins awarded immediately.
      const family = state.families[state.currentFamily];
      const chore = family.chores.find(c => c.id === action.choreId);
      if (!chore) return state;

      const completion = {
        id: uuidv4(),
        choreId: action.choreId,
        kidId: action.kidId,
        photoData: action.photoData || null,
        submittedAt: new Date().toISOString(),
        approvedAt: null,
        status: 'pending', // pending | approved | rejected
      };

      // Award coins + XP immediately
      const updatedKids = family.kids.map(k => {
        if (k.id !== action.kidId) return k;
        return {
          ...k,
          coins: k.coins + chore.coins,
          totalCoinsEarned: k.totalCoinsEarned + chore.coins,
          xp: k.xp + chore.xp,
        };
      });

      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: {
            ...family,
            kids: updatedKids,
            pendingCompletions: [...family.pendingCompletions, completion],
          },
        },
      };
    }

    case 'APPROVE_COMPLETION': {
      const family = state.families[state.currentFamily];
      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: {
            ...family,
            pendingCompletions: family.pendingCompletions.map(p =>
              p.id === action.completionId
                ? { ...p, status: 'approved', approvedAt: new Date().toISOString() }
                : p
            ),
          },
        },
      };
    }

    case 'REJECT_COMPLETION': {
      // Return coins/xp to kid
      const family = state.families[state.currentFamily];
      const completion = family.pendingCompletions.find(p => p.id === action.completionId);
      if (!completion) return state;
      const chore = family.chores.find(c => c.id === completion.choreId);
      if (!chore) return state;

      const updatedKids = family.kids.map(k => {
        if (k.id !== completion.kidId) return k;
        return {
          ...k,
          coins: Math.max(0, k.coins - chore.coins),
          totalCoinsEarned: Math.max(0, k.totalCoinsEarned - chore.coins),
          xp: Math.max(0, k.xp - chore.xp),
        };
      });

      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: {
            ...family,
            kids: updatedKids,
            pendingCompletions: family.pendingCompletions.map(p =>
              p.id === action.completionId
                ? { ...p, status: 'rejected', approvedAt: new Date().toISOString() }
                : p
            ),
          },
        },
      };
    }

    case 'REDEEM_REWARD': {
      const family = state.families[state.currentFamily];
      const reward = family.rewards.find(r => r.id === action.rewardId);
      if (!reward) return state;

      const updatedKids = family.kids.map(k => {
        if (k.id !== action.kidId) return k;
        if (k.coins < reward.cost) return k;
        return { ...k, coins: k.coins - reward.cost };
      });

      return {
        ...state,
        families: {
          ...state.families,
          [state.currentFamily]: { ...family, kids: updatedKids },
        },
      };
    }

    case 'LEAVE_FAMILY': {
      return { ...state, currentFamily: null, currentView: 'landing', currentKidId: null };
    }

    default:
      return state;
  }
}

// ─── Provider ──────────────────────────────────────────────────────────────

const STORAGE_KEY = 'chorequest_v1';

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE, (init) => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...init, ...parsed, currentView: 'landing', currentKidId: null };
      }
    } catch {}
    return init;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      families: state.families,
      currentFamily: state.currentFamily,
    }));
  }, [state.families, state.currentFamily]);

  const family = state.currentFamily ? state.families[state.currentFamily] : null;

  const getKid = useCallback((kidId) => {
    return family?.kids.find(k => k.id === kidId) || null;
  }, [family]);

  // Check if a chore was completed today by a kid
  const isChoreCompletedToday = useCallback((choreId, kidId) => {
    if (!family) return false;
    const today = new Date().toDateString();
    return family.pendingCompletions.some(p =>
      p.choreId === choreId &&
      p.kidId === kidId &&
      p.status !== 'rejected' &&
      new Date(p.submittedAt).toDateString() === today
    );
  }, [family]);

  const value = {
    state,
    dispatch,
    family,
    getKid,
    isChoreCompletedToday,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
