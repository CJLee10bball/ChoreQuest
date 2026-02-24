import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PRELOADED_CHORES, TIER_CONFIG } from '../../data/preloadedChores';
import Modal from '../shared/Modal';

const ICONS = ['📋','🧹','🍽️','🛏️','🗑️','💧','🐾','🌿','⚔️','🛡️','📜','🏰','🪙','🐉','🔥','🧽'];
const TIERS = ['daily','weekly','bonus'];

export default function ManageChores({ onToast }) {
  const { family, dispatch } = useApp();
  const [showAdd, setShowAdd]   = useState(false);
  const [showPre, setShowPre]   = useState(false);
  const [filterTier, setFilterTier] = useState('all');
  const [editChore, setEditChore] = useState(null);
  const [confirmRemove, setConfirmRemove] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '', description: '', icon: '📋', tier: 'daily',
    coins: 5, xp: 10, isRecurring: true, assignedTo: [],
  });

  function resetForm() {
    setForm({ name:'', description:'', icon:'📋', tier:'daily', coins:5, xp:10, isRecurring:true, assignedTo:[] });
  }

  function handleAddPreloaded(chore) {
    // Check not already added
    const alreadyAdded = family.chores.some(c => c.name === chore.name);
    if (alreadyAdded) { onToast('That quest is already on the board!', 'error'); return; }
    dispatch({ type: 'ADD_CHORE', ...chore, assignedTo: [] });
    onToast(`"${chore.name}" added to the quest board!`, 'success');
  }

  function handleSubmitCustom(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editChore) {
      dispatch({ type: 'UPDATE_CHORE', choreId: editChore.id, updates: { ...form } });
      onToast('Quest updated!', 'success');
      setEditChore(null);
    } else {
      dispatch({ type: 'ADD_CHORE', ...form, name: form.name.trim() });
      onToast(`"${form.name.trim()}" added!`, 'success');
      setShowAdd(false);
    }
    resetForm();
  }

  function openEdit(chore) {
    setForm({
      name: chore.name, description: chore.description || '',
      icon: chore.icon, tier: chore.tier, coins: chore.coins,
      xp: chore.xp, isRecurring: chore.isRecurring, assignedTo: chore.assignedTo || [],
    });
    setEditChore(chore);
  }

  function toggleAssign(kidId) {
    setForm(f => ({
      ...f,
      assignedTo: f.assignedTo.includes(kidId)
        ? f.assignedTo.filter(id => id !== kidId)
        : [...f.assignedTo, kidId],
    }));
  }

  const filtered = filterTier === 'all'
    ? family.chores
    : family.chores.filter(c => c.tier === filterTier);

  const inputClass = "w-full px-3 py-2 rounded border-2 border-amber-700 bg-amber-50 text-amber-900 focus:outline-none text-sm";

  function ChoreForm({ onCancel }) {
    return (
      <form onSubmit={handleSubmitCustom} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">Quest Name</label>
            <input className={inputClass} placeholder="Name thy quest..." value={form.name}
              onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
          </div>
          <div className="col-span-2">
            <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">Description</label>
            <input className={inputClass} placeholder="What must be done..." value={form.description}
              onChange={e => setForm(f => ({...f, description: e.target.value}))} />
          </div>
          <div>
            <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">Tier</label>
            <select className={inputClass} value={form.tier}
              onChange={e => setForm(f => ({...f, tier: e.target.value}))}>
              <option value="daily">🔴 Daily Decree</option>
              <option value="weekly">🟡 Weekly Quest</option>
              <option value="bonus">🔵 Bonus Bounty</option>
            </select>
          </div>
          <div>
            <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">Icon</label>
            <select className={inputClass} value={form.icon}
              onChange={e => setForm(f => ({...f, icon: e.target.value}))}>
              {ICONS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">Gold Coins 🪙</label>
            <input className={inputClass} type="number" min="1" max="100" value={form.coins}
              onChange={e => setForm(f => ({...f, coins: Number(e.target.value)}))} />
          </div>
          <div>
            <label className="block text-amber-900 text-xs font-bold mb-1 uppercase tracking-wide">XP ⚡</label>
            <input className={inputClass} type="number" min="1" max="500" value={form.xp}
              onChange={e => setForm(f => ({...f, xp: Number(e.target.value)}))} />
          </div>
        </div>

        {/* Assign to kids */}
        {family.kids.length > 0 && (
          <div>
            <label className="block text-amber-900 text-xs font-bold mb-2 uppercase tracking-wide">
              Assign To (leave empty = all)
            </label>
            <div className="flex flex-wrap gap-2">
              {family.kids.map(kid => (
                <button key={kid.id} type="button"
                  onClick={() => toggleAssign(kid.id)}
                  className={`px-3 py-1 rounded-full text-xs border-2 font-semibold transition-all ${
                    form.assignedTo.includes(kid.id)
                      ? 'bg-amber-700 border-amber-500 text-amber-100'
                      : 'bg-amber-100 border-amber-400 text-amber-800'
                  }`}>
                  {kid.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input type="checkbox" id="recurring" checked={form.isRecurring}
            onChange={e => setForm(f => ({...f, isRecurring: e.target.checked}))}
            className="accent-amber-600" />
          <label htmlFor="recurring" className="text-amber-900 text-xs font-semibold">Recurring quest</label>
        </div>

        <div className="flex gap-2 pt-1">
          <button type="button" onClick={onCancel} className="btn-stone flex-1 py-2 text-sm">Cancel</button>
          <button type="submit" className="btn-gold flex-1 py-2 text-sm">
            {editChore ? '✅ Save Changes' : '⚔️ Add Quest'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-medieval text-amber-900 text-xl">Quest Board</h2>
        <div className="flex gap-2">
          <button onClick={() => { setShowPre(true); }} className="btn-stone text-xs py-1.5 px-3">
            📜 Pre-loaded
          </button>
          <button onClick={() => { resetForm(); setShowAdd(true); }} className="btn-gold text-xs py-1.5 px-3">
            + Custom
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {[['all','All'],['daily','🔴 Daily'],['weekly','🟡 Weekly'],['bonus','🔵 Bonus']].map(([v,l]) => (
          <button key={v} onClick={() => setFilterTier(v)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
              filterTier === v
                ? 'bg-amber-800 border-amber-600 text-amber-100'
                : 'bg-amber-100 border-amber-400 text-amber-800 hover:bg-amber-200'
            }`}>
            {l}
          </button>
        ))}
      </div>

      {/* Chore list */}
      {filtered.length === 0 ? (
        <div className="text-center py-10 text-amber-700 italic">
          <div className="text-5xl mb-3">📜</div>
          <p>No quests on the board yet.</p>
          <p className="text-sm mt-1">Add pre-loaded or custom quests above!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(chore => {
            const cfg = TIER_CONFIG[chore.tier];
            return (
              <div key={chore.id} className={`rounded-lg p-3 flex items-center gap-3 ${cfg.color}`}>
                <span className="text-2xl flex-shrink-0">{chore.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{chore.name}</div>
                  <div className="text-xs opacity-75 truncate">{chore.description}</div>
                  <div className="flex gap-3 mt-1 text-xs opacity-80">
                    <span>🪙 {chore.coins}</span>
                    <span>⚡ {chore.xp} XP</span>
                    <span className="capitalize">{cfg.badgeText}</span>
                    {chore.assignedTo?.length > 0 && (
                      <span>👤 {chore.assignedTo.map(id => family.kids.find(k=>k.id===id)?.name).filter(Boolean).join(', ')}</span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(chore)}
                    className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded transition-colors">✏️</button>
                  <button onClick={() => setConfirmRemove(chore)}
                    className="text-xs px-2 py-1 bg-red-900/50 hover:bg-red-800 rounded transition-colors">🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Add Modal */}
      {showAdd && (
        <Modal title="⚔️ Create Custom Quest" onClose={() => setShowAdd(false)} wide>
          <ChoreForm onCancel={() => setShowAdd(false)} />
        </Modal>
      )}

      {/* Edit Modal */}
      {editChore && (
        <Modal title="✏️ Edit Quest" onClose={() => setEditChore(null)} wide>
          <ChoreForm onCancel={() => setEditChore(null)} />
        </Modal>
      )}

      {/* Pre-loaded Modal */}
      {showPre && (
        <Modal title="📜 Pre-loaded Quests" onClose={() => setShowPre(false)} wide>
          <p className="text-amber-700 text-xs mb-4 italic">
            Click to add a pre-made quest to thy board
          </p>
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {PRELOADED_CHORES.map(chore => {
              const cfg = TIER_CONFIG[chore.tier];
              const added = family.chores.some(c => c.name === chore.name);
              return (
                <div key={chore.id} className={`rounded-lg p-3 flex items-center gap-3 ${cfg.color} ${added ? 'opacity-50' : ''}`}>
                  <span className="text-xl">{chore.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{chore.name}</div>
                    <div className="text-xs opacity-75">{chore.description}</div>
                    <div className="text-xs mt-0.5 opacity-70">🪙 {chore.coins} · ⚡ {chore.xp} XP · {cfg.badgeText}</div>
                  </div>
                  <button
                    onClick={() => handleAddPreloaded(chore)}
                    disabled={added}
                    className={`text-xs px-3 py-1 rounded font-bold flex-shrink-0 ${added ? 'bg-white/20 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30 cursor-pointer'}`}
                  >
                    {added ? '✓ Added' : '+ Add'}
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={() => setShowPre(false)} className="btn-gold w-full mt-4 py-2 text-sm">Done</button>
        </Modal>
      )}

      {/* Confirm Remove */}
      {confirmRemove && (
        <Modal title="🗑️ Remove Quest?" onClose={() => setConfirmRemove(null)}>
          <p className="text-amber-800 text-sm mb-4">
            Remove <strong>"{confirmRemove.name}"</strong> from the quest board?
          </p>
          <div className="flex gap-2">
            <button onClick={() => setConfirmRemove(null)} className="btn-stone flex-1 py-2 text-sm">Nevermind</button>
            <button onClick={() => { dispatch({ type:'REMOVE_CHORE', choreId: confirmRemove.id }); setConfirmRemove(null); onToast('Quest removed.','info'); }}
              className="btn-crimson flex-1 py-2 text-sm">Remove</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
