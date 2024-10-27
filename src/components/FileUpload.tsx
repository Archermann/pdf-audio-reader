
import { useDropzone } from 'react-dropzone';
import { Book } from 'lucide-react';


interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export default function FileUpload({ onFileUpload }: FileUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB limit
    onDropRejected: (fileRejections) => {
      const rejection = fileRejections[0];
      if (rejection.errors[0].code === 'file-too-large') {
        alert('File is too large. Please upload a PDF smaller than 50MB.');
      } else if (rejection.errors[0].code === 'file-invalid-type') {
        alert('Please upload a valid PDF file.');
      }
    },
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        onFileUpload(file);
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 mb-8 text-center transition-colors cursor-pointer
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
    >
      <input {...getInputProps()} />
      <Book className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <p className="text-gray-600 mb-2">
        {isDragActive
          ? 'Drop your PDF here'
          : 'Drag & drop a PDF file here, or click to select one'}
      </p>
      <p className="text-sm text-gray-500">Maximum file size: 50MB</p>
    </div>
  );
}