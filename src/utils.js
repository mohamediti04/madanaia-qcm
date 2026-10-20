import * as Speech from 'expo-speech';

export const KEYS = ['Ø£', 'Ø¨', 'Ø¬', 'Ø¯', 'Ù‡Ù€'];

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function stopSpeech() {
  try {
    Speech.stop();
  } catch (e) {
    /* noop */
  }
}

export function speak(text) {
  if (!text) return;
  try {
    Speech.stop();
    Speech.speak(text, { language: 'ar', rate: 0.95, pitch: 1.0 });
  } catch (e) {
    /* noop */
  }
}

