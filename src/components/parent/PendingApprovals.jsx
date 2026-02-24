import { useApp } from '../../context/AppContext';
import Modal from '../shared/Modal';
import { useState } from 'react';
import { TIER_CONFIG } from '../../data/preloadedChores';

export default function PendingApprovals({ onToast }) {
  const { family, dispatch } = useApp();
  const [viewing, setViewing] = useState(null); // { completion, chore, kid }

  const pending = (family?.pendingCompletions || [])
    .filter(p => p.status === 'pending')
    .map(p => ({
      completion: p,
      chore: family.chores.find(c => c.id === p.choreId),
      kid: family.kids.find(k => k.id === p.kidId),
    }))
    .filter(x => x.chore && x.kid)
    .sort((a, b) => new Date(b.completion.submittedAt) - new Date(a.completion.submittedAt));

  function approve(completionId, kidName) {
    dispatch({ type: 'APPROVE_COMPLETION', completionId });
    onToast(`${kidName}'s quest approved! Gold already awarded. ✅`, 'success');
    setViewing(null);
  }

  function reject(completionId, kidName, choreName) {
    dispatch({ type: 'REJECT_COMPLETION', completionId });
    onToast(`${kidName}'s "${choreName}" was rejected. Coins returned.`, 'error');
    setViewing(null);
  }

  function formatTime(iso) {
    const d = new Date(iso);
    return d.toLocaleString('en-US', { month:'short', day:'numeric', hour:'numeric', minute:'2-digit' });
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="font-medieval text-amber-900 text-xl">Quest Reviews</h2>
        {pending.length > 0 && (
          <span className="bg-red-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {pending.length}
          </span>
        )}
      </div>

      <p className="text-amber-700 text-xs italic mb-4">
        "Coins are awarded upon completion. Reject only if the quest was not truly fulfilled."
      </p>

      {pending.length === 0 ? (
        <div className="text-center py-10 text-amber-700 italic">
          <div className="text-5xl mb-3">✅</div>
          <p>No quests awaiting review.</p>
          <p className="text-sm mt-1">Thy adventurers are still at work!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pending.map(({ completion, chore, kid }) => {
            const cfg = TIER_CONFIG[chore.tier];
            return (
              <div key={completion.id} className={`rounded-lg p-3 flex items-center gap-3 ${cfg.color}`}>
                <span className="text-2xl flex-shrink-0">{chore.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{chore.name}</div>
                  <div className="text-xs opacity-80">by <strong>{kid.name}</strong> · {formatTime(completion.submittedAt)}</div>
                  <div className="text-xs mt-0.5 opacity-70">🪙 {chore.coins} already awarded</div>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {completion.photoData && (
                    <button onClick={() => setViewing({ completion, chore, kid })}
                      className="text-xs px-2 py-1 bg-white/20 hover:bg-white/30 rounded">📸</button>
                  )}
                  <button onClick={() => approve(completion.id, kid.name)}
                    className="text-xs px-2 py-1 bg-green-700 hover:bg-green-600 rounded font-bold">✓</button>
                  <button onClick={() => reject(completion.id, kid.name, chore.name)}
                    className="text-xs px-2 py-1 bg-red-800 hover:bg-red-700 rounded font-bold">✗</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Recently reviewed */}
      {(() => {
        const reviewed = (family?.pendingCompletions || [])
          .filter(p => p.status !== 'pending')
          .slice(-5)
          .reverse()
          .map(p => ({
            completion: p,
            chore: family.chores.find(c => c.id === p.choreId),
            kid: family.kids.find(k => k.id === p.kidId),
          }))
          .filter(x => x.chore && x.kid);

        if (reviewed.length === 0) return null;
        return (
          <div className="mt-6">
            <h3 className="text-amber-800 text-xs font-bold uppercase tracking-wide mb-2">Recently Reviewed</h3>
            <div className="space-y-2">
              {reviewed.map(({ completion, chore, kid }) => (
                <div key={completion.id} className="bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 flex items-center gap-3 opacity-70">
                  <span className="text-lg">{chore.icon}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-amber-300 text-sm font-semibold">{chore.name}</span>
                    <span className="text-amber-500 text-xs ml-2">by {kid.name}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${completion.status === 'approved' ? 'bg-green-800 text-green-200' : 'bg-red-800 text-red-200'}`}>
                    {completion.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Photo viewer */}
      {viewing && (
        <Modal title={`📸 ${viewing.kid.name}'s Photo — ${viewing.chore.name}`} onClose={() => setViewing(null)}>
          <img src={viewing.completion.photoData} alt="completion proof"
            className="w-full rounded-lg mb-4 border-2 border-amber-600" />
          <div className="flex gap-2">
            <button onClick={() => reject(viewing.completion.id, viewing.kid.name, viewing.chore.name)}
              className="btn-crimson flex-1 py-2 text-sm">✗ Reject</button>
            <button onClick={() => approve(viewing.completion.id, viewing.kid.name)}
              className="btn-forest flex-1 py-2 text-sm">✓ Approve</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
