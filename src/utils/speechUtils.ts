export class SpeechSynthesisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SpeechSynthesisError';
  }
}

export function createUtterance(text: string, volume: number): SpeechSynthesisUtterance {
  if (!window.speechSynthesis) {
    throw new SpeechSynthesisError('Speech synthesis is not supported in this browser');
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.volume = volume;
  return utterance;
}

export function stopSpeech(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function pauseSpeech(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.pause();
  }
}

export function resumeSpeech(): void {
  if (window.speechSynthesis) {
    window.speechSynthesis.resume();
  }
}