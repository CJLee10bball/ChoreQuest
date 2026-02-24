import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ChoreCard from '../components/kid/ChoreCard';
import ChoreComplete from '../components/kid/ChoreComplete';
import TreasureChest from '../components/kid/TreasureChest';
import CharacterView from '../components/kid/CharacterView';
import Toast from '../components/shared/Toast';
import { TIER_CONFIG, getLevelInfo } from '../data/preloadedChores';

const TABS = [
  { id: 'quests',    label: 'Quests',    icon: '📜' },
  { id: 'character', label: 'Character', icon: '⚔️' },
  { id: 'treasure',  label: 'Treasure',  icon: '💰' },
];

export default function KidDashboard() {
  const { state, family, dispatch, isChoreCompletedToday } = useApp();
  const kid = family?.kids.find(k => k.id === state.currentKidId);

  const [tab, setTab]             = useState('quests');
  const [completing, setCompleting] = useState(null); // chore being completed
  const [toast, setToast]         = useState(null);
  const [celebrateCoins, setCelebrateCoins] = useState(null);

  if (!kid) {
    dispatch({ type: 'SET_VIEW', view: 'landing' });
    return null;
  }

  const { current } = getLevelInfo(kid.xp);
  const avatarEmoji = { knight:'⚔️', princess:'👸', wizard:'🧙', archer:'🏹' }[kid.avatar] || '⚔️';

  // Get chores for this kid (assigned to them or assigned to everyone)
  const myChores = (family?.chores || []).filter(c =>
    !c.assignedTo?.length || c.assignedTo.includes(kid.id)
  );

  const byTier = {
    daily:  myChores.filter(c => c.tier === 'daily'),
    weekly: myChores.filter(c => c.tier === 'weekly'),
    bonus:  myChores.filter(c => c.tier === 'bonus'),
  };

  const todayCompleted  = myChores.filter(c => isChoreCompletedToday(c.id, kid.id)).length;
  const totalChores     = myChores.length;

  function handleCompletionConfirm(photoData) {
    if (!completing) return;
    dispatch({
      type: 'SUBMIT_COMPLETION',
      choreId: completing.id,
      kidId: kid.id,
      photoData,
    });
    setCelebrateCoins(completing.coins);
    setToast({ message: `Quest complete! +${completing.coins} gold coins! 🪙`, type: 'success', id: Date.now() });
    setCompleting(null);
    setTimeout(() => setCelebrateCoins(null), 2500);
  }

  function showToast(message, type) {
    setToast({ message, type, id: Date.now() });
  }

  const TIER_ORDER = ['daily','weekly','bonus'];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a0f0a 0%, #2c1810 50%, #1a0f0a 100%)' }}>
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Gold coins celebration */}
      {celebrateCoins && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div className="text-center toast-appear">
            <div className="text-8xl coin-shine">🪙</div>
            <div className="text-amber-300 font-medieval text-3xl gold-text mt-2">+{celebrateCoins}!</div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-amber-900/80 border-b-2 border-amber-700 backdrop-blur">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{avatarEmoji}</span>
            <div>
              <div className="text-amber-100 font-bold text-sm leading-tight">{kid.name}</div>
              <div className="text-amber-400 text-xs">{current.icon} {current.title}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-amber-300 font-bold text-sm">🪙 {kid.coins}</div>
              <div className="text-amber-500 text-xs">{todayCompleted}/{totalChores} today</div>
            </div>
            <button
              onClick={() => dispatch({ type: 'SET_VIEW', view: 'landing' })}
              className="btn-stone text-xs py-1.5 px-2"
            >←</button>
          </div>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-amber-950/60 border-b border-amber-800">
        <div className="max-w-xl mx-auto flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-all flex flex-col items-center gap-0.5 ${
                tab === t.id
                  ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-900/40'
                  : 'text-amber-600 hover:text-amber-400'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-xl mx-auto p-4">
        {tab === 'quests' && (
          <div className="fade-in">
            {totalChores === 0 ? (
              <div className="parchment-bg scroll-border rounded-lg p-8 text-center">
                <div className="text-5xl mb-3">🏰</div>
                <p className="text-amber-800 italic">No quests have been decreed yet.</p>
                <p className="text-amber-700 text-sm mt-1">Thy parent must assign quests!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {TIER_ORDER.map(tier => {
                  const chores = byTier[tier];
                  if (!chores.length) return null;
                  const cfg = TIER_CONFIG[tier];
                  const doneCount = chores.filter(c => isChoreCompletedToday(c.id, kid.id)).length;

                  return (
                    <div key={tier}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                          {cfg.badgeText}
                        </div>
                        <span className="text-amber-600 text-xs">{cfg.sublabel}</span>
                        <span className="text-amber-500 text-xs ml-auto">{doneCount}/{chores.length}</span>
                      </div>
                      <div className="space-y-2">
                        {chores.map(chore => (
                          <ChoreCard
                            key={chore.id}
                            chore={chore}
                            isCompleted={isChoreCompletedToday(chore.id, kid.id)}
                            onComplete={() => setCompleting(chore)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}

                {/* Daily progress bar */}
                {totalChores > 0 && (
                  <div className="parchment-bg scroll-border rounded-lg p-4">
                    <div className="flex justify-between text-xs text-amber-800 font-bold mb-2">
                      <span>⚔️ Daily Progress</span>
                      <span>{todayCompleted} / {totalChores} quests</span>
                    </div>
                    <div className="xp-bar-bg h-3 rounded-full">
                      <div
                        className="xp-bar-fill h-full rounded-full"
                        style={{ width: `${totalChores ? (todayCompleted / totalChores) * 100 : 0}%` }}
                      />
                    </div>
                    {todayCompleted === totalChores && totalChores > 0 && (
                      <p className="text-center text-amber-700 text-xs italic mt-2 font-bold">
                        🎉 All quests complete! Thou art a true champion!
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {tab === 'character' && (
          <div className="parchment-bg scroll-border rounded-lg p-5 fade-in">
            <CharacterView kid={kid} />
          </div>
        )}

        {tab === 'treasure' && (
          <div className="parchment-bg scroll-border rounded-lg p-5 fade-in">
            <TreasureChest kid={kid} onToast={showToast} />
          </div>
        )}
      </main>

      {/* Chore completion modal */}
      {completing && (
        <ChoreComplete
          chore={completing}
          kid={kid}
          onConfirm={handleCompletionConfirm}
          onCancel={() => setCompleting(null)}
        />
      )}
    </div>
  );
}
