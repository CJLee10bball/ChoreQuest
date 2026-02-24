import { getLevelInfo, LEVEL_THRESHOLDS } from '../../data/preloadedChores';

const AVATAR_ART = {
  knight: {
    emoji: '⚔️',
    art: `
  🛡️⚔️🛡️
  👑  👑
 [🧙‍♂️]
  ⚔️ ⚔️
 /| |\\
`,
    color: 'from-slate-700 to-slate-900',
    border: 'border-slate-500',
    glow: 'shadow-slate-500/50',
  },
  princess: {
    emoji: '👸',
    art: '',
    color: 'from-pink-800 to-purple-900',
    border: 'border-pink-500',
    glow: 'shadow-pink-500/50',
  },
  wizard: {
    emoji: '🧙',
    art: '',
    color: 'from-purple-800 to-indigo-900',
    border: 'border-purple-500',
    glow: 'shadow-purple-500/50',
  },
  archer: {
    emoji: '🏹',
    art: '',
    color: 'from-green-800 to-emerald-900',
    border: 'border-green-500',
    glow: 'shadow-green-500/50',
  },
};

const AVATAR_EMOJI = { knight:'⚔️', princess:'👸', wizard:'🧙‍♂️', archer:'🏹' };

export default function CharacterView({ kid }) {
  const { current, next, xpIntoLevel, xpForNext, progress } = getLevelInfo(kid.xp);
  const avatarStyle = AVATAR_ART[kid.avatar] || AVATAR_ART.knight;
  const avatarEmoji = AVATAR_EMOJI[kid.avatar] || '⚔️';

  // Build visual character levels
  const starsEarned = current.level;

  return (
    <div>
      {/* Character card */}
      <div className={`bg-gradient-to-br ${avatarStyle.color} border-2 ${avatarStyle.border} rounded-2xl p-5 text-center mb-5 shadow-xl ${avatarStyle.glow}`}>
        {/* Avatar */}
        <div className="relative inline-block mb-3">
          <div className="text-8xl dragon-float">{avatarEmoji}</div>
          <div className="absolute -top-2 -right-2 bg-amber-500 text-amber-950 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm border-2 border-amber-300">
            {current.level}
          </div>
        </div>

        <h2 className="text-white font-bold text-xl mb-0.5">{kid.name}</h2>
        <div className="text-amber-300 font-semibold text-sm">{current.icon} {current.title}</div>

        {/* Stars */}
        <div className="flex justify-center gap-1 mt-3 mb-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < starsEarned ? 'opacity-100' : 'opacity-20'}`}>⭐</span>
          ))}
        </div>

        {/* XP Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-amber-300">
            <span>Level {current.level}</span>
            {next && <span>Level {next.level}</span>}
          </div>
          <div className="xp-bar-bg h-3 rounded-full">
            <div className="xp-bar-fill h-full rounded-full" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-amber-400 text-center">
            {next
              ? `${xpIntoLevel} / ${xpForNext} XP to become ${next.icon} ${next.title}`
              : '🌟 Maximum Level Achieved!'}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { icon:'🪙', value: kid.coins,            label:'Gold' },
          { icon:'⚡', value: kid.xp,               label:'Total XP' },
          { icon:'🏅', value: kid.totalCoinsEarned, label:'Earned' },
        ].map(stat => (
          <div key={stat.label} className="bg-amber-900/40 border border-amber-700 rounded-lg py-3 text-center">
            <div className="text-xl">{stat.icon}</div>
            <div className="font-bold text-amber-200 text-lg">{stat.value}</div>
            <div className="text-amber-500 text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Level milestones */}
      <h3 className="font-medieval text-amber-900 text-base mb-3">⚜️ Path of Glory</h3>
      <div className="space-y-1.5">
        {LEVEL_THRESHOLDS.map(lvl => {
          const reached = kid.xp >= lvl.xpRequired;
          const isCurrent = lvl.level === current.level;
          return (
            <div key={lvl.level}
              className={`rounded-lg px-3 py-2 flex items-center gap-3 border transition-all ${
                isCurrent
                  ? 'bg-amber-700 border-amber-500 text-amber-100 font-bold'
                  : reached
                  ? 'bg-amber-900/50 border-amber-700/50 text-amber-300'
                  : 'bg-amber-950/30 border-amber-800/30 text-amber-600 opacity-50'
              }`}>
              <span className="text-lg">{lvl.icon}</span>
              <span className="flex-1 text-sm">{lvl.title}</span>
              <span className="text-xs opacity-70">Lvl {lvl.level}</span>
              {reached && !isCurrent && <span className="text-green-400 text-xs">✓</span>}
              {isCurrent && <span className="text-amber-300 text-xs font-bold">← YOU</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
