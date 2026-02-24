import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../shared/Modal';

const ICONS = ['🎁','🍕','🎮','🎬','🏖️','🍦','🎉','📚','🧸','🎵','🏆','⭐'];

export default function ManageRewards({ onToast }) {
  const { family, dispatch } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(null);
  const [form, setForm] = useState({ name:'', description:'', cost:20, icon:'🎁' });

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    dispatch({ type: 'ADD_REWARD', ...form, name: form.name.trim() });
    onToast(`"${form.name.trim()}" added to the reward treasury!`, 'success');
    setForm({ name:'', description:'', cost:20, icon:'🎁' });
    setShowAdd(false);
  }

  const inputClass = "w-full px-3 py-2 rounded border-2 border-amber-700 bg-amber-50 text-amber-900 focus:outline-none text-sm";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medieval text-amber-900 text-xl">Royal Treasury</h2>
        <button onClick={() => setShowAdd(true)} className="btn-gold text-xs py-1.5 px-3">
          + Add Reward
        </button>
      </div>

      <p className="text-amber-700 text-xs italic mb-4">
        "Set forth the prizes that brave adventurers may claim with their hard-earned gold"
      </p>

      {family.rewards.length === 0 ? (
        <div className="text-center py-10 text-amber-700 italic">
          <div className="text-5xl mb-3">🏆</div>
          <p>The treasury is empty!</p>
          <p className="text-sm mt-1">Add rewards to motivate thy adventurers.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {family.rewards.map(reward => (
            <div key={reward.id} className="bg-gradient-to-br from-amber-900 to-yellow-900 border-2 border-amber-600 rounded-lg p-4 flex items-center gap-3">
              <div className="text-3xl flex-shrink-0">{reward.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-amber-100 text-sm truncate">{reward.name}</div>
                {reward.description && (
                  <div className="text-amber-300 text-xs truncate">{reward.description}</div>
                )}
                <div className="text-amber-400 font-bold text-sm mt-1">🪙 {reward.cost} gold</div>
              </div>
              <button onClick={() => setConfirmRemove(reward)}
                className="text-red-400 hover:text-red-300 text-xs flex-shrink-0">🗑️</button>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <Modal title="🎁 Add New Reward" onClose={() => setShowAdd(false)}>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">Reward Name</label>
              <input className={inputClass} placeholder="e.g. Extra Screen Time" value={form.name}
                onChange={e => setForm(f=>({...f, name:e.target.value}))} autoFocus required />
            </div>
            <div>
              <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">Description (optional)</label>
              <input className={inputClass} placeholder="e.g. 30 extra minutes of games" value={form.description}
                onChange={e => setForm(f=>({...f, description:e.target.value}))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">Cost 🪙</label>
                <input className={inputClass} type="number" min="1" max="9999" value={form.cost}
                  onChange={e => setForm(f=>({...f, cost:Number(e.target.value)}))} />
              </div>
              <div>
                <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">Icon</label>
                <select className={inputClass} value={form.icon}
                  onChange={e => setForm(f=>({...f, icon:e.target.value}))}>
                  {ICONS.map(ic => <option key={ic} value={ic}>{ic} {ic}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowAdd(false)} className="btn-stone flex-1 py-2 text-sm">Cancel</button>
              <button type="submit" className="btn-gold flex-1 py-2 text-sm">🏆 Add Reward</button>
            </div>
          </form>
        </Modal>
      )}

      {confirmRemove && (
        <Modal title="🗑️ Remove Reward?" onClose={() => setConfirmRemove(null)}>
          <p className="text-amber-800 text-sm mb-4">
            Remove <strong>"{confirmRemove.name}"</strong> from the treasury?
          </p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmRemove(null)} className="btn-stone flex-1 py-2 text-sm">Nevermind</button>
            <button onClick={() => { dispatch({type:'REMOVE_REWARD', rewardId:confirmRemove.id}); setConfirmRemove(null); onToast('Reward removed.','info'); }}
              className="btn-crimson flex-1 py-2 text-sm">Remove</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
