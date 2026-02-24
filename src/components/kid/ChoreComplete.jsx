import { useRef, useState, useCallback } from 'react';
import Modal from '../shared/Modal';
import { TIER_CONFIG } from '../../data/preloadedChores';

export default function ChoreComplete({ chore, kid, onConfirm, onCancel }) {
  const cfg = TIER_CONFIG[chore.tier];
  const [step, setStep]           = useState('confirm'); // confirm | camera | done
  const [photoData, setPhotoData] = useState(null);
  const [cameraError, setCameraError] = useState('');
  const [stream, setStream]       = useState(null);
  const videoRef  = useRef(null);
  const canvasRef = useRef(null);

  async function startCamera() {
    setCameraError('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setStream(s);
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.play();
      }
      setStep('camera');
    } catch {
      setCameraError('Could not access the royal eye (camera). You may skip the photo.');
    }
  }

  function stopCamera() {
    stream?.getTracks().forEach(t => t.stop());
    setStream(null);
  }

  function capturePhoto() {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width  = video.videoWidth  || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext('2d').drawImage(video, 0, 0);
    const data = canvas.toDataURL('image/jpeg', 0.7);
    setPhotoData(data);
    stopCamera();
    setStep('done');
  }

  function handleFileUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      setPhotoData(ev.target.result);
      stopCamera();
      setStep('done');
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    onConfirm(photoData);
  }

  function handleSkipPhoto() {
    stopCamera();
    onConfirm(null);
  }

  function handleCancel() {
    stopCamera();
    onCancel();
  }

  return (
    <Modal title={`${chore.icon} ${chore.name}`} onClose={handleCancel}>
      {step === 'confirm' && (
        <div className="text-center space-y-4">
          <div className={`rounded-lg p-4 ${cfg.color} mb-2`}>
            <div className="text-4xl mb-2">{chore.icon}</div>
            <div className="font-bold text-sm">{chore.name}</div>
            {chore.description && <div className="text-xs opacity-75 mt-1">{chore.description}</div>}
            <div className="flex justify-center gap-4 mt-3 text-sm font-bold">
              <span>🪙 +{chore.coins} Gold</span>
              <span>⚡ +{chore.xp} XP</span>
            </div>
          </div>

          <p className="text-amber-800 text-sm font-semibold">
            Hast thou truly completed this quest, brave <span className="text-amber-600">{kid.name}</span>?
          </p>

          <p className="text-amber-700 text-xs italic">
            "A royal portrait of thy completed deed shall be taken as proof"
          </p>

          {cameraError && (
            <p className="text-red-600 text-xs">{cameraError}</p>
          )}

          <div className="space-y-2">
            <button onClick={startCamera} className="btn-gold w-full py-2 text-sm">
              📸 Take a Victory Photo!
            </button>
            <label className="btn-stone w-full py-2 text-sm cursor-pointer flex items-center justify-center gap-2">
              📁 Upload from Gallery
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={handleSkipPhoto} className="text-amber-600 hover:text-amber-800 text-xs underline w-full py-1">
              Skip photo &amp; claim gold
            </button>
          </div>

          <button onClick={handleCancel} className="text-amber-500 text-xs underline">
            Not done yet — go back
          </button>
        </div>
      )}

      {step === 'camera' && (
        <div className="space-y-3">
          <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio:'4/3' }}>
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-2">
            <button onClick={() => { stopCamera(); setStep('confirm'); }} className="btn-stone flex-1 py-2 text-sm">
              ← Back
            </button>
            <button onClick={capturePhoto} className="btn-gold flex-1 py-2 text-sm">
              📸 Capture!
            </button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <div className="space-y-4 text-center">
          {photoData && (
            <div>
              <img src={photoData} alt="proof" className="w-full rounded-lg border-2 border-amber-600 mb-2" />
              <button onClick={() => { setPhotoData(null); setStep('confirm'); }}
                className="text-amber-600 text-xs underline">Retake photo</button>
            </div>
          )}
          <div className="bg-amber-900/40 border-2 border-amber-600 rounded-lg p-4">
            <div className="text-4xl mb-2 coin-shine">🪙</div>
            <div className="text-amber-200 font-bold">+{chore.coins} Gold Coins!</div>
            <div className="text-amber-400 text-sm">+{chore.xp} XP</div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
          <button onClick={handleSubmit} className="btn-gold w-full py-3 text-base">
            ⚔️ Claim thy Reward!
          </button>
        </div>
      )}
    </Modal>
  );
}
