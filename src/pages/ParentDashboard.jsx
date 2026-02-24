import { useState } from 'react';
import { useApp } from '../context/AppContext';
import ManageKids from '../components/parent/ManageKids';
import ManageChores from '../components/parent/ManageChores';
import ManageRewards from '../components/parent/ManageRewards';
import PendingApprovals from '../components/parent/PendingApprovals';
import Toast from '../components/shared/Toast';

const TABS = [
  { id: 'quests',    label: 'Quests',    icon: '📜' },
  { id: 'adventurers', label: 'Adventurers', icon: '⚔️' },
  { id: 'treasury',  label: 'Treasury',  icon: '🏆' },
  { id: 'reviews',   label: 'Reviews',   icon: '📋' },
];

export default function ParentDashboard() {
  const { family, dispatch } = useApp();
  const [tab, setTab]         = useState('quests');
  const [toast, setToast]     = useState(null);

  const pendingCount = family?.pendingCompletions?.filter(p => p.status === 'pending').length || 0;

  function showToast(message, type = 'success') {
    setToast({ message, type, id: Date.now() });
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #1a0f0a 0%, #2c1810 50%, #1a0f0a 100%)' }}>
      {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      {/* Header */}
      <header className="bg-amber-900/80 border-b-2 border-amber-700 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="font-medieval text-amber-200 text-xl leading-tight">⚜️ Royal Command</h1>
            <p className="text-amber-400 text-xs">{family?.name} · Code: <span className="font-bold text-amber-300">{family?.code}</span></p>
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_VIEW', view: 'landing' })}
            className="btn-stone text-xs py-1.5 px-3"
          >
            ← Exit
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="bg-amber-950/60 border-b border-amber-800">
        <div className="max-w-2xl mx-auto flex">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex-1 py-3 text-xs font-bold uppercase tracking-wide transition-all flex flex-col items-center gap-0.5 ${
                tab === t.id
                  ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-900/40'
                  : 'text-amber-600 hover:text-amber-400 hover:bg-amber-900/20'
              }`}
            >
              <span className="text-base">{t.icon}</span>
              <span className="hidden sm:block">{t.label}</span>
              {t.id === 'reviews' && pendingCount > 0 && (
                <span className="absolute top-1 right-1 bg-red-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-2xl mx-auto p-4">
        <div className="parchment-bg scroll-border rounded-lg p-5 min-h-64 fade-in">
          {tab === 'quests'       && <ManageChores  onToast={showToast} />}
          {tab === 'adventurers'  && <ManageKids    onToast={showToast} />}
          {tab === 'treasury'     && <ManageRewards onToast={showToast} />}
          {tab === 'reviews'      && <PendingApprovals onToast={showToast} />}
        </div>

        {/* Stats footer */}
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Quests', value: family?.chores?.length || 0, icon: '📜' },
            { label: 'Adventurers', value: family?.kids?.length || 0, icon: '⚔️' },
            { label: 'Rewards', value: family?.rewards?.length || 0, icon: '🏆' },
          ].map(stat => (
            <div key={stat.label} className="bg-amber-900/40 border border-amber-700 rounded-lg py-2 px-3">
              <div className="text-xl">{stat.icon}</div>
              <div className="text-amber-200 font-bold text-lg">{stat.value}</div>
              <div className="text-amber-500 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
