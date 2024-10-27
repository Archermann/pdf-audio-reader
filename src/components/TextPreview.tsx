import React from 'react';

interface TextPreviewProps {
  text: string;
}

export default function TextPreview({ text }: TextPreviewProps) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold mb-2">PDF Content Preview:</h2>
      <div className="max-h-64 overflow-y-auto">
        <p className="text-gray-700 whitespace-pre-line">{text}</p>
      </div>
    </div>
  );
}