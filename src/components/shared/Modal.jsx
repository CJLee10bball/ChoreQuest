export default function Modal({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4"
         style={{ background: 'rgba(0,0,0,0.75)' }}
         onClick={onClose}>
      <div
        className={`relative parchment-bg rounded-lg scroll-border fade-in ${wide ? 'max-w-2xl' : 'max-w-md'} w-full max-h-[90vh] overflow-y-auto`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-2 border-amber-800">
          <h2 className="font-medieval text-amber-900 text-lg">{title}</h2>
          <button
            onClick={onClose}
            className="text-amber-800 hover:text-red-700 text-2xl leading-none font-bold"
          >×</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
