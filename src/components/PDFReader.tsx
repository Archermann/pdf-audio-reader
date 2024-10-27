import React, { useState, useRef, useEffect } from 'react';
import { extractTextFromPDF, PDFProcessingError } from '../utils/pdfUtils';
import { createUtterance, stopSpeech, pauseSpeech, resumeSpeech } from '../utils/speechUtils';
import FileUpload from './FileUpload';
import AudioControls from './AudioControls';
import TextPreview from './TextPreview';
import ErrorMessage from './ErrorMessage';
import LoadingSpinner from './LoadingSpinner';

export default function PDFReader() {
  const [text, setText] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      if (utteranceRef.current) {
        stopSpeech();
      }
    };
  }, []);

  const handleFileUpload = async (file: File) => {
    try {
      setError(null);
      setIsProcessing(true);
      setText('');
      stopSpeech();

      const extractedText = await extractTextFromPDF(file);
      setText(extractedText);
    } catch (err) {
      console.error('PDF processing error:', err);
      if (err instanceof PDFProcessingError) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while processing the PDF');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const startSpeaking = () => {
    if (!text) return;

    try {
      stopSpeech(); // Clear any existing speech
      utteranceRef.current = createUtterance(text, volume);
      
      utteranceRef.current.onend = () => {
        setIsPlaying(false);
        utteranceRef.current = null;
      };
      
      utteranceRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setError('Failed to start text-to-speech. Please try again.');
        setIsPlaying(false);
        utteranceRef.current = null;
      };

      window.speechSynthesis.speak(utteranceRef.current);
      setIsPlaying(true);
    } catch (err) {
      setError('Text-to-speech is not supported in your browser');
      console.error('Speech synthesis error:', err);
    }
  };

  const handlePause = () => {
    try {
      pauseSpeech();
      setIsPlaying(false);
    } catch (err) {
      setError('Failed to pause speech');
    }
  };

  const handleStop = () => {
    try {
      stopSpeech();
      setIsPlaying(false);
      utteranceRef.current = null;
    } catch (err) {
      setError('Failed to stop speech');
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (utteranceRef.current) {
      utteranceRef.current.volume = newVolume;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">PDF Audio Reader</h1>
          <p className="text-gray-600">Upload your PDF and listen to it</p>
        </div>

        {error && <ErrorMessage message={error} onDismiss={() => setError(null)} />}

        <FileUpload onFileUpload={handleFileUpload} />

        {isProcessing && <LoadingSpinner />}

        {text && !isProcessing && (
          <>
            <AudioControls
              isPlaying={isPlaying}
              volume={volume}
              onPlay={startSpeaking}
              onPause={handlePause}
              onStop={handleStop}
              onVolumeChange={handleVolumeChange}
            />
            <TextPreview text={text} />
          </>
        )}
      </div>
    </div>
  );
}