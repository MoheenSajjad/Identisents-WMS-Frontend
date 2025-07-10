import React, { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';
import { Upload, X, FileImage } from 'lucide-react';
import { Input } from '../input';
import { Shake } from '@/components/parts/animations';

interface UploadedImage {
  file: File;
  preview: string;
}

interface ImageUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  onFileChange?: (file: File | null) => void;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  disabled?: boolean;
  className?: string;
  error?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  onFileChange,
  label = 'Image',
  placeholder = 'Upload an image',
  isRequired = false,
  disabled = false,
  className = '',
  error,
}) => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value && !uploadedImage) {
      setUploadedImage({
        file: new File([], 'existing-image', { type: 'image/jpeg' }),
        preview: value,
      });
    }
  }, [value, uploadedImage]);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = e => {
        if (e.target?.result) {
          const preview = e.target.result as string;
          setUploadedImage({
            file,
            preview,
          });

          // Call onChange with the data URL for form value
          onChange?.(preview);
          // Call onFileChange with the actual file
          onFileChange?.(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    if (!disabled) {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelect(files[0]);
      }
    }
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onChange?.('');
    onFileChange?.(null);
  };

  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <Shake shouldShake={!!error}>
      <div className={className}>
        {label && <Input.Label value={label} isRequired={isRequired} />}

        {!uploadedImage ? (
          <div
            className={`relative rounded-md border-2 border-dashed p-4 text-center transition-all duration-200 ${
              disabled ? 'cursor-not-allowed border-gray-200 bg-gray-50' : 'cursor-pointer'
            } ${
              isDragOver && !disabled
                ? 'border-blue-500 bg-blue-50'
                : error
                  ? 'border-red-300 hover:border-red-400'
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
              disabled={disabled}
            />

            <div className="flex flex-col items-center space-y-2">
              <Upload
                className={`h-6 w-6 ${
                  disabled
                    ? 'text-gray-300'
                    : isDragOver
                      ? 'text-blue-500'
                      : error
                        ? 'text-red-400'
                        : 'text-gray-400'
                }`}
              />
              <div>
                <p
                  className={`text-sm font-medium ${
                    disabled
                      ? 'text-gray-400'
                      : isDragOver
                        ? 'text-blue-600'
                        : error
                          ? 'text-red-600'
                          : 'text-gray-600'
                  }`}
                >
                  {isDragOver && !disabled ? 'Drop image here' : placeholder}
                </p>
                {!disabled && (
                  <p className="text-xs text-gray-500">Click or drag to upload • JPG, PNG, GIF</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <img
                src={uploadedImage.preview}
                alt="Preview"
                className="h-32 w-full rounded-md border border-gray-200 object-cover"
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white transition-colors hover:bg-red-600"
                  title="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>

            {/* File Info */}
            <div className="flex items-center space-x-2 rounded-md bg-gray-50 p-2">
              <FileImage className="h-4 w-4 flex-shrink-0 text-blue-600" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-gray-900">
                  {uploadedImage.file.name || 'Uploaded image'}
                </p>
                {uploadedImage.file.size > 0 && (
                  <p className="text-xs text-gray-500">
                    {(uploadedImage.file.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={handleUploadClick}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  Change
                </button>
              )}
            </div>
          </div>
        )}

        {/* {error && <p className="mt-1 text-xs text-red-600">{error}</p>} */}
      </div>
    </Shake>
  );
};
