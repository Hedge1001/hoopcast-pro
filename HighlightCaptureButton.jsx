import { useCallback, useRef, useState } from 'react';
import { getClipsForMoment } from '../services/xbotgoService';
import './HighlightCaptureButton.css';

// Two highlight-capture paths, matched to what's actually available today:
//
//  1. LOCAL CAMERA CLIP — if the user grants camera/mic access, we keep a
//     rolling buffer of recent MediaRecorder chunks so hitting "capture"
//     saves the last ~8s *before* the moment plus a few seconds after,
//     like an instant-replay button. This works with any webcam/phone
//     camera right now, no vendor integration required.
//
//  2. XBOTGO CLIP LOOKUP — Xbotgo's own camera units already auto-clip
//     highlights. Once credentials exist, getClipsForMoment() (currently a
//     stub) will fetch the matching clip instead of relying on the local
//     camera. Both paths write to the same highlight record shape.
//
// This component only exposes the button + status; HighlightReel renders
// the resulting list.

const BUFFER_MS = 8000;

export default function HighlightCaptureButton({ gameId, player, statLabel, onCaptured }) {
  const [status, setStatus] = useState('idle'); // idle | arming | capturing | done | error
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);

  const ensureCamera = useCallback(async () => {
    if (streamRef.current) return streamRef.current;
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream, { mimeType: pickMimeType() });
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push({ blob: e.data, t: Date.now() });
        // Trim the rolling buffer to the last BUFFER_MS of chunks.
        const cutoff = Date.now() - BUFFER_MS;
        chunksRef.current = chunksRef.current.filter((c) => c.t >= cutoff);
      }
    };
    recorder.start(1000); // 1s timeslices so the rolling buffer is granular
    recorderRef.current = recorder;
    return stream;
  }, []);

  const captureLocalClip = useCallback(async () => {
    const clipBlobs = chunksRef.current.map((c) => c.blob);
    if (clipBlobs.length === 0) return null;
    const blob = new Blob(clipBlobs, { type: clipBlobs[0].type || 'video/webm' });
    return URL.createObjectURL(blob);
  }, []);

  const handleCapture = useCallback(async () => {
    setStatus('arming');
    const timestampSeconds = Math.floor(Date.now() / 1000);

    let clipUrl = null;
    let source = 'none';

    try {
      await ensureCamera();
      setStatus('capturing');
      // Give the rolling buffer a moment to include a beat after the play.
      await new Promise((r) => setTimeout(r, 1200));
      clipUrl = await captureLocalClip();
      source = clipUrl ? 'local' : 'none';
    } catch (err) {
      // Camera unavailable/denied — fall back to the Xbotgo lookup below.
      console.warn('HoopCast: local camera capture unavailable.', err);
    }

    if (!clipUrl) {
      const xbotgo = await getClipsForMoment(gameId, timestampSeconds);
      clipUrl = xbotgo.clipUrl;
      source = 'xbotgo';
    }

    onCaptured({
      id: `hl-${Date.now()}`,
      gameId,
      playerId: player.id,
      playerName: player.name,
      statLabel,
      timestampSeconds,
      clipUrl,
      source,
      createdAt: new Date().toISOString(),
    });

    setStatus(clipUrl ? 'done' : 'error');
    setTimeout(() => setStatus('idle'), 1500);
  }, [ensureCamera, captureLocalClip, gameId, player, statLabel, onCaptured]);

  return (
    <button
      className={`highlight-btn highlight-btn--${status}`}
      onClick={handleCapture}
      disabled={status === 'arming' || status === 'capturing'}
      title="Capture a highlight clip for this play"
    >
      {labelFor(status)}
    </button>
  );
}

function labelFor(status) {
  switch (status) {
    case 'arming':
      return 'Arming…';
    case 'capturing':
      return 'Capturing…';
    case 'done':
      return 'Saved ✓';
    case 'error':
      return 'No clip available';
    default:
      return '🎬 Capture Highlight';
  }
}

function pickMimeType() {
  const candidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  return candidates.find((type) => MediaRecorder.isTypeSupported?.(type)) || '';
}
