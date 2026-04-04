/**
 * Web Audio API ile programatik bildirim sesleri
 * Harici dosya gerektirmez — tarayıcıda anında üretilir
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  // Suspended durumda ise resume et (kullanıcı etkileşimi sonrası)
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

function playTone(
  frequency: number,
  duration: number,
  startTime: number,
  volume: number = 0.3,
  type: OscillatorType = "sine"
) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, ctx.currentTime + startTime);

  gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(volume, ctx.currentTime + startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(
    0.001,
    ctx.currentTime + startTime + duration
  );

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + duration);
}

/** Chatbot başvurusu — kısa "ding" */
export function playSubmissionSound() {
  playTone(880, 0.3, 0, 0.25, "sine"); // A5
  playTone(1100, 0.4, 0.15, 0.2, "sine"); // ~C#6
}

/** Sözleşme imzalandı — çift tonlu kutlama */
export function playContractSound() {
  playTone(660, 0.25, 0, 0.25, "sine"); // E5
  playTone(880, 0.25, 0.2, 0.25, "sine"); // A5
  playTone(1100, 0.5, 0.4, 0.3, "sine"); // ~C#6
}

/** Ödeme alındı — üçlü başarı melodisi */
export function playPaymentSound() {
  playTone(523, 0.2, 0, 0.25, "sine"); // C5
  playTone(659, 0.2, 0.15, 0.25, "sine"); // E5
  playTone(784, 0.2, 0.3, 0.25, "sine"); // G5
  playTone(1047, 0.5, 0.45, 0.3, "sine"); // C6
}

/** Yeni lead — hafif bildirim */
export function playLeadSound() {
  playTone(600, 0.3, 0, 0.15, "triangle");
  playTone(800, 0.3, 0.2, 0.15, "triangle");
}

/** AudioContext'i kullanıcı etkileşimiyle başlat (autoplay policy) */
export function initAudioContext() {
  getAudioContext();
}
