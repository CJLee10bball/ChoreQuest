import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); onClose?.(); }, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  if (!visible) return null;

  const bg = {
    success: 'bg-yellow-900 border-yellow-500 text-yellow-100',
    error:   'bg-red-900 border-red-500 text-red-100',
    info:    'bg-blue-900 border-blue-500 text-blue-100',
  }[type];

  const icon = { success: '⚔️', error: '💀', info: '📜' }[type];

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 toast-appear px-5 py-3 rounded-lg border-2 shadow-2xl flex items-center gap-3 ${bg}`}>
      <span className="text-xl">{icon}</span>
      <span className="font-semibold text-sm">{message}</span>
    </div>
  );
}
