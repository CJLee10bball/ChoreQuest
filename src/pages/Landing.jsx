import { useState } from 'react';
import { useApp } from '../context/AppContext';
import Toast from '../components/shared/Toast';

export default function Landing() {
  const { state, dispatch, family } = useApp();
  const [tab, setTab] = useState('join');        // join | create
  const [familyCode, setFamilyCode] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [pin, setPin]     = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  function handleJoin(e) {
    e.preventDefault();
    const code = familyCode.trim().toUpperCase();
    if (!state.families[code]) {
      setError('No realm found with that code. Check thy spelling!');
      return;
    }
    dispatch({ type: 'JOIN_FAMILY', code });
    setToast({ message: 'Welcome back to the realm!', type: 'success' });
  }

  function handleCreate(e) {
    e.preventDefault();
    if (!familyName.trim()) { setError('Thy family needs a name!'); return; }
    if (pin.length < 4)     { setError('The PIN must be at least 4 digits.'); return; }
    if (pin !== pinConfirm) { setError('The PINs do not match!'); return; }
    dispatch({ type: 'CREATE_FAMILY', name: familyName.trim(), pin });
  }

  // If a family is loaded, show chooser screen
  if (state.currentFamily && family) {
    return <FamilyChooser family={family} dispatch={dispatch} />;
  }

  const inputClass = "w-full px-3 py-2 rounded border-2 border-amber-700 bg-amber-50 text-amber-900 focus:outline-none focus:border-amber-500 text-sm";

  return (
    <div className="min-h-screen castle-bg flex flex-col items-center justify-center p-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Title */}
      <div className="text-center mb-8 fade-in">
        <div className="dragon-float text-7xl mb-2">🐉</div>
        <h1 className="font-medieval text-5xl gold-text drop-shadow-lg tracking-wide">ChoreQuest</h1>
        <p className="text-amber-300 mt-2 text-sm tracking-widest uppercase font-semibold">
          A Royal Adventure in Household Valour
        </p>
      </div>

      {/* Card */}
      <div className="parchment-bg scroll-border rounded-lg w-full max-w-sm fade-in shadow-2xl">
        {/* Tabs */}
        <div className="flex border-b-2 border-amber-700">
          {[['join','Enter a Realm'],['create','Found a Realm']].map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setTab(key); setError(''); }}
              className={`flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-all ${
                tab === key
                  ? 'bg-amber-800 text-amber-100'
                  : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
              }`}
            >{label}</button>
          ))}
        </div>

        <div className="p-5">
          {tab === 'join' ? (
            <form onSubmit={handleJoin} className="space-y-4">
              <p className="text-amber-800 text-xs text-center italic">
                "Enter thy family realm code to begin thy quests"
              </p>
              <div>
                <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">
                  Realm Code
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. DRAGON1234"
                  value={familyCode}
                  onChange={e => { setFamilyCode(e.target.value); setError(''); }}
                  autoCapitalize="characters"
                />
              </div>
              {error && <p className="text-red-700 text-xs font-semibold text-center">{error}</p>}
              <button type="submit" className="btn-gold w-full py-2 text-sm">
                ⚔️ Enter the Realm
              </button>
            </form>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <p className="text-amber-800 text-xs text-center italic">
                "Establish thy family's seat of power"
              </p>
              <div>
                <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">
                  Family Name
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. House Thornwood"
                  value={familyName}
                  onChange={e => { setFamilyName(e.target.value); setError(''); }}
                />
              </div>
              <div>
                <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">
                  Parent PIN (4+ digits)
                </label>
                <input
                  className={inputClass}
                  type="password"
                  inputMode="numeric"
                  placeholder="••••"
                  value={pin}
                  onChange={e => { setPin(e.target.value); setError(''); }}
                />
              </div>
              <div>
                <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">
                  Confirm PIN
                </label>
                <input
                  className={inputClass}
                  type="password"
                  inputMode="numeric"
                  placeholder="••••"
                  value={pinConfirm}
                  onChange={e => { setPinConfirm(e.target.value); setError(''); }}
                />
              </div>
              {error && <p className="text-red-700 text-xs font-semibold text-center">{error}</p>}
              <button type="submit" className="btn-gold w-full py-2 text-sm">
                🏰 Found the Realm
              </button>
            </form>
          )}
        </div>
      </div>

      <p className="text-amber-800/60 text-xs mt-6 text-center max-w-xs">
        Your realm data is stored safely on this device. Share your realm code with family members to let them join.
      </p>
    </div>
  );
}

// ── Family Chooser ──────────────────────────────────────────────────────────

function FamilyChooser({ family, dispatch }) {
  const [showPin, setShowPin] = useState(false);
  const [pin, setPin]         = useState('');
  const [pinError, setPinError] = useState('');
  const [kidId, setKidId]     = useState(null);

  function handleParent(e) {
    e.preventDefault();
    if (pin !== family.parentPin) {
      setPinError('Wrong PIN, my liege. Try again.');
      return;
    }
    dispatch({ type: 'SET_VIEW', view: 'parent' });
  }

  function handleKid(id) {
    dispatch({ type: 'SET_VIEW', view: 'kid', kidId: id });
  }

  return (
    <div className="min-h-screen castle-bg flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6 fade-in">
        <div className="dragon-float text-6xl mb-2">🐉</div>
        <h1 className="font-medieval text-4xl gold-text">ChoreQuest</h1>
        <p className="text-amber-400 text-sm mt-1">{family.name}</p>
        <p className="text-amber-600 text-xs mt-1 tracking-widest">
          REALM CODE: <span className="text-amber-300 font-bold">{family.code}</span>
        </p>
      </div>

      <div className="parchment-bg scroll-border rounded-lg w-full max-w-md fade-in p-5 shadow-2xl">
        {/* Parent Entry */}
        <div className="mb-5 pb-5 border-b-2 border-amber-700">
          {!showPin ? (
            <button
              onClick={() => setShowPin(true)}
              className="btn-crimson w-full py-2 text-sm"
            >
              👑 Enter as Parent
            </button>
          ) : (
            <form onSubmit={handleParent} className="space-y-3">
              <p className="text-amber-900 text-xs font-bold uppercase tracking-wide text-center">
                Enter Parent PIN
              </p>
              <input
                type="password"
                inputMode="numeric"
                placeholder="••••"
                className="w-full px-3 py-2 rounded border-2 border-amber-700 bg-amber-50 text-amber-900 focus:outline-none focus:border-amber-500 text-center text-lg tracking-widest"
                value={pin}
                onChange={e => { setPin(e.target.value); setPinError(''); }}
                autoFocus
              />
              {pinError && <p className="text-red-700 text-xs text-center font-semibold">{pinError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowPin(false)} className="btn-stone flex-1 py-2 text-sm">
                  Cancel
                </button>
                <button type="submit" className="btn-crimson flex-1 py-2 text-sm">
                  Enter 👑
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Kids */}
        <p className="text-amber-800 text-xs font-bold uppercase tracking-wide text-center mb-3">
          ⚔️ Choose Your Adventurer
        </p>
        {family.kids.length === 0 ? (
          <p className="text-amber-700 text-center text-sm italic py-4">
            No adventurers yet! A parent must add them first.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {family.kids.map(kid => (
              <button
                key={kid.id}
                onClick={() => handleKid(kid.id)}
                className="bg-amber-900 hover:bg-amber-800 border-2 border-amber-600 rounded-lg p-3 text-center transition-all hover:scale-105 hover:shadow-lg"
              >
                <div className="text-3xl mb-1">
                  {kid.avatar === 'knight'   ? '⚔️' :
                   kid.avatar === 'princess' ? '👸' :
                   kid.avatar === 'wizard'   ? '🧙' : '🏹'}
                </div>
                <div className="text-amber-100 font-bold text-sm">{kid.name}</div>
                <div className="text-amber-400 text-xs mt-1">🪙 {kid.coins}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => dispatch({ type: 'LEAVE_FAMILY' })}
        className="mt-4 text-amber-700 hover:text-amber-400 text-xs underline transition-colors"
      >
        Switch Realm
      </button>
    </div>
  );
}
