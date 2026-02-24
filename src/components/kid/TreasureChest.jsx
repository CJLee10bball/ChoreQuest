import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../shared/Modal';

export default function TreasureChest({ kid, onToast }) {
  const { family, dispatch } = useApp();
  const [confirmRedeem, setConfirmRedeem] = useState(null);

  function redeem(reward) {
    if (kid.coins < reward.cost) {
      onToast('Not enough gold, brave adventurer!', 'error');
      return;
    }
    dispatch({ type: 'REDEEM_REWARD', kidId: kid.id, rewardId: reward.id });
    onToast(`🎉 "${reward.name}" claimed! Thy parent shall grant this boon.`, 'success');
    setConfirmRedeem(null);
  }

  const totalEarned = family?.pendingCompletions
    ?.filter(p => p.kidId === kid.id && p.status !== 'rejected')
    .length || 0;

  return (
    <div>
      {/* Treasure summary */}
      <div className="bg-gradient-to-br from-amber-900 to-yellow-900 border-2 border-amber-500 rounded-xl p-5 text-center mb-5">
        <div className="text-5xl coin-shine mb-2">💰</div>
        <div className="font-medieval text-amber-200 text-3xl font-bold">{kid.coins}</div>
        <div className="text-amber-400 text-sm">Gold Coins in thy Chest</div>
        <div className="text-amber-500 text-xs mt-1">
          {kid.totalCoinsEarned} total earned · {totalEarned} quests completed
        </div>
      </div>

      {/* Rewards */}
      <h3 className="font-medieval text-amber-900 text-lg mb-3">🏆 Royal Treasury</h3>

      {family?.rewards?.length === 0 ? (
        <div className="text-center py-8 text-amber-700 italic">
          <div className="text-4xl mb-2">🏰</div>
          <p className="text-sm">No rewards have been decreed yet.</p>
          <p className="text-xs mt-1">Ask thy parent to add some prizes!</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {family.rewards.map(reward => {
            const canAfford = kid.coins >= reward.cost;
            return (
              <div
                key={reward.id}
                onClick={() => canAfford && setConfirmRedeem(reward)}
                className={`rounded-xl p-4 flex items-center gap-3 border-2 transition-all ${
                  canAfford
                    ? 'bg-gradient-to-r from-amber-800 to-yellow-800 border-amber-500 cursor-pointer hover:scale-105 hover:shadow-xl'
                    : 'bg-amber-950/40 border-amber-800/50 opacity-60 cursor-not-allowed'
                }`}
              >
                <span className="text-3xl flex-shrink-0">{reward.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className={`font-bold text-sm ${canAfford ? 'text-amber-100' : 'text-amber-400'}`}>
                    {reward.name}
                  </div>
                  {reward.description && (
                    <div className="text-xs text-amber-300/70 truncate">{reward.description}</div>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`font-bold text-sm ${canAfford ? 'text-amber-300' : 'text-amber-600'}`}>
                    🪙 {reward.cost}
                  </div>
                  {canAfford ? (
                    <div className="text-green-400 text-xs font-bold">Claim!</div>
                  ) : (
                    <div className="text-red-400 text-xs">Need {reward.cost - kid.coins} more</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirm Redeem Modal */}
      {confirmRedeem && (
        <Modal title="🎁 Claim This Reward?" onClose={() => setConfirmRedeem(null)}>
          <div className="text-center space-y-4">
            <div className="text-5xl">{confirmRedeem.icon}</div>
            <div>
              <div className="font-bold text-amber-900 text-lg">{confirmRedeem.name}</div>
              {confirmRedeem.description && (
                <div className="text-amber-700 text-sm mt-1">{confirmRedeem.description}</div>
              )}
            </div>
            <div className="bg-amber-100 border-2 border-amber-600 rounded-lg p-3">
              <div className="text-amber-800 text-sm">
                Cost: <strong>🪙 {confirmRedeem.cost} gold</strong>
              </div>
              <div className="text-amber-700 text-sm">
                Remaining after: <strong>🪙 {kid.coins - confirmRedeem.cost}</strong>
              </div>
            </div>
            <p className="text-amber-700 text-xs italic">
              "Show this to thy parent to claim thy rightful prize!"
            </p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmRedeem(null)} className="btn-stone flex-1 py-2 text-sm">
                Nevermind
              </button>
              <button onClick={() => redeem(confirmRedeem)} className="btn-gold flex-1 py-2 text-sm">
                🎉 Claim It!
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
