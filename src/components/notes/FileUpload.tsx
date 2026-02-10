import React, { useRef, useState } from 'react';
import { Upload, File, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
  onRemove: () => void;
  accept?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  selectedFile,
  onRemove,
  accept = '.pdf,.doc,.docx,.txt',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (selectedFile) {
    return (
      <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50">
        <div className="flex items-center gap-3">
          <File size={24} className="text-primary-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
        <button
          onClick={onRemove}
          className="p-1 rounded hover:bg-gray-200 transition-colors"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
    );
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
        isDragging
          ? 'border-primary-500 bg-primary-50'
          : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
      )}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />
      <Upload size={48} className="mx-auto text-gray-400 mb-4" />
      <p className="text-sm font-medium text-gray-700 mb-1">
        Click to upload or drag and drop
      </p>
      <p className="text-xs text-gray-500">
        PDF, DOC, DOCX, or TXT (Max 10MB)
      </p>
    </div>
  );
};
