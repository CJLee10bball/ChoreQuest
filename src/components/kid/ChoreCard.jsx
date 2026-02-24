import { TIER_CONFIG } from '../../data/preloadedChores';

export default function ChoreCard({ chore, isCompleted, onComplete }) {
  const cfg = TIER_CONFIG[chore.tier];

  return (
    <div className={`rounded-xl p-4 transition-all ${cfg.color} ${isCompleted ? 'opacity-50 scale-95' : 'hover:scale-102 hover:shadow-xl cursor-pointer'}`}
         onClick={!isCompleted ? onComplete : undefined}>
      <div className="flex items-start gap-3">
        {/* Icon + completion state */}
        <div className="relative flex-shrink-0">
          <span className="text-3xl">{isCompleted ? '✅' : chore.icon}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm leading-tight mb-0.5">{chore.name}</div>
          {chore.description && (
            <div className="text-xs opacity-75 leading-tight">{chore.description}</div>
          )}
          <div className="flex gap-3 mt-2 text-xs font-semibold opacity-90">
            <span>🪙 {chore.coins}</span>
            <span>⚡ {chore.xp} XP</span>
          </div>
        </div>

        {!isCompleted && (
          <div className="flex-shrink-0 bg-white/20 hover:bg-white/30 rounded-lg px-2 py-1 text-xs font-bold transition-colors">
            Do it! →
          </div>
        )}
        {isCompleted && (
          <div className="flex-shrink-0 bg-green-700/40 rounded-lg px-2 py-1 text-xs font-bold text-green-200">
            Done! ✓
          </div>
        )}
      </div>
    </div>
  );
}
