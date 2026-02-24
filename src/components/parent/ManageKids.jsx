import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getLevelInfo, AVATARS } from '../../data/preloadedChores';
import Modal from '../shared/Modal';

export default function ManageKids({ onToast }) {
  const { family, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName]       = useState('');
  const [avatar, setAvatar]   = useState('knight');
  const [confirmRemove, setConfirmRemove] = useState(null);

  function addKid(e) {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch({ type: 'ADD_KID', name: name.trim(), avatar });
    setName(''); setAvatar('knight'); setShowAdd(false);
    onToast(`${name.trim()} has joined the realm!`, 'success');
  }

  function removeKid(kid) {
    dispatch({ type: 'REMOVE_KID', kidId: kid.id });
    setConfirmRemove(null);
    onToast(`${kid.name} has been removed.`, 'info');
  }

  const avatarEmoji = { knight:'⚔️', princess:'👸', wizard:'🧙', archer:'🏹' };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medieval text-amber-900 text-xl">Royal Adventurers</h2>
        <button onClick={() => setShowAdd(true)} className="btn-gold text-xs py-1.5 px-3">
          + Enlist
        </button>
      </div>

      {family.kids.length === 0 ? (
        <div className="text-center py-10 text-amber-700 italic">
          <div className="text-5xl mb-3">🛡️</div>
          <p>No adventurers have been enlisted yet.</p>
          <p className="text-sm mt-1">Add thy children to begin their quest!</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {family.kids.map(kid => {
            const { current, next, progress } = getLevelInfo(kid.xp);
            return (
              <div key={kid.id} className="bg-amber-900/40 border-2 border-amber-700 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-3xl">{avatarEmoji[kid.avatar] || '⚔️'}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-amber-100 truncate">{kid.name}</div>
                    <div className="text-xs text-amber-400">{current.icon} {current.title}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-300 font-bold text-sm">🪙 {kid.coins}</div>
                    <div className="text-amber-500 text-xs">Lvl {current.level}</div>
                  </div>
                </div>

                {/* XP bar */}
                <div className="xp-bar-bg h-2 mb-3">
                  <div className="xp-bar-fill h-full" style={{ width: `${progress}%` }} />
                </div>
                <div className="flex justify-between text-xs text-amber-500 mb-3">
                  <span>{kid.xp} XP total</span>
                  {next && <span>→ {next.xpRequired} for Lvl {next.level}</span>}
                </div>

                <button
                  onClick={() => setConfirmRemove(kid)}
                  className="text-red-400 hover:text-red-300 text-xs underline"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Kid Modal */}
      {showAdd && (
        <Modal title="⚔️ Enlist New Adventurer" onClose={() => setShowAdd(false)}>
          <form onSubmit={addKid} className="space-y-4">
            <div>
              <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">
                Adventurer's Name
              </label>
              <input
                className="w-full px-3 py-2 rounded border-2 border-amber-700 bg-amber-50 text-amber-900 focus:outline-none text-sm"
                placeholder="e.g. Sir Timmy"
                value={name}
                onChange={e => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div>
              <label className="block text-amber-900 text-xs font-bold mb-2 uppercase tracking-wide">
                Choose Class
              </label>
              <div className="grid grid-cols-2 gap-2">
                {AVATARS.map(a => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setAvatar(a.id)}
                    className={`p-3 rounded-lg border-2 text-center transition-all ${
                      avatar === a.id
                        ? 'border-amber-500 bg-amber-800 text-amber-100'
                        : 'border-amber-700 bg-amber-100 text-amber-900 hover:bg-amber-200'
                    }`}
                  >
                    <div className="text-2xl">{a.emoji}</div>
                    <div className="text-xs font-bold mt-1">{a.label}</div>
                    <div className="text-xs opacity-70">{a.description}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-stone flex-1 py-2 text-sm">
                Cancel
              </button>
              <button type="submit" className="btn-gold flex-1 py-2 text-sm">
                Enlist! ⚔️
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Confirm Remove */}
      {confirmRemove && (
        <Modal title="⚠️ Remove Adventurer?" onClose={() => setConfirmRemove(null)}>
          <p className="text-amber-800 text-sm mb-4">
            Art thou sure thou wishest to remove <strong>{confirmRemove.name}</strong>?
            Their coins and progress shall be lost forever.
          </p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmRemove(null)} className="btn-stone flex-1 py-2 text-sm">
              Nevermind
            </button>
            <button onClick={() => removeKid(confirmRemove)} className="btn-crimson flex-1 py-2 text-sm">
              Remove
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
