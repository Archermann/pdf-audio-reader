import React from 'react';
import { Pause, Play, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface AudioControlsProps {
  isPlaying: boolean;
  volume: number;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AudioControls({
  isPlaying,
  volume,
  onPlay,
  onPause,
  onStop,
  onVolumeChange,
}: AudioControlsProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button
          onClick={onStop}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Reset"
        >
          <SkipBack className="w-6 h-6 text-gray-600" />
        </button>

        <button
          onClick={isPlaying ? onPause : onPlay}
          className="p-4 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause className="w-8 h-8 text-white" />
          ) : (
            <Play className="w-8 h-8 text-white" />
          )}
        </button>

        <button
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          title="Skip"
        >
          <SkipForward className="w-6 h-6 text-gray-600" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <Volume2 className="w-5 h-5 text-gray-600" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={onVolumeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}