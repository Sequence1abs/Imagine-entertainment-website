'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  formatBytes,
  useFileUpload,
  type FileWithPreview,
} from '@/hooks/use-file-upload';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ImageIcon, TriangleAlert, Upload, X, ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GalleryUploadProps {
  defaultImages?: Array<{ id: string; url: string }>;
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  className?: string;
  isUploading?: boolean;
  onFilesChange?: (files: File[]) => void;
  onRemoveExisting?: (id: string) => void;
  onUpload?: () => void;
}

export function GalleryUpload({
  defaultImages = [],
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = 'image/*',
  className,
  isUploading = false,
  onFilesChange,
  onRemoveExisting,
  onUpload,
}: GalleryUploadProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState(defaultImages);

  const [
    { files, isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple: true,
    onFilesChange: (newFiles) => {
      const fileObjects = newFiles.map((f) => f.file as File).filter((f) => f instanceof File);
      onFilesChange?.(fileObjects);
    },
  });

  const handleRemoveExisting = (id: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
    onRemoveExisting?.(id);
  };

  const isImage = (file: File | any) => {
    if (file instanceof File) {
      return file.type.startsWith('image/');
    }
    return true;
  };

  const totalImages = existingImages.length + files.length;

  return (
    <div className={cn('w-full', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-xl border transition-all duration-200',
          isDragging
            ? 'border-2 border-dashed border-primary bg-primary/5'
            : 'border-dashed border-border bg-muted/30 hover:border-primary hover:bg-primary/5',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-3 p-8 text-center">
          <div
            className={cn(
              'flex size-14 items-center justify-center rounded-xl transition-colors',
              isDragging ? 'bg-primary/10' : 'bg-muted',
            )}
          >
            <ImageIcon className={cn('size-6', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold">Upload images to gallery</h3>
            <p className="text-xs text-muted-foreground">Drag and drop images here or click to browse</p>
            <p className="text-xs text-muted-foreground">
              Up to {formatBytes(maxSize)} each (max {maxFiles} files)
            </p>
          </div>

          <Button onClick={openFileDialog} type="button" size="sm">
            <Upload className="size-4" />
            Select Images
          </Button>
        </div>
      </div>

      {/* Gallery Stats */}
      {totalImages > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <h4 className="text-sm font-medium">
              Gallery ({totalImages}/{maxFiles})
            </h4>
            {files.length > 0 && (
              <div className="text-xs text-muted-foreground">
                New: {formatBytes(files.reduce((acc, file) => acc + (file.file as File).size, 0))}
              </div>
            )}
          </div>
          {files.length > 0 && (
            <div className="flex items-center gap-2">
              <Button onClick={clearFiles} type="button" variant="outline" size="sm" className="flex-1 sm:flex-initial">
                Clear New
              </Button>
              {onUpload && (
                <Button onClick={onUpload} type="button" size="sm" disabled={isUploading} className="flex-1 sm:flex-initial">
                  {isUploading ? 'Uploading...' : `Upload ${files.length} Image${files.length !== 1 ? 's' : ''}`}
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Image Grid */}
      {totalImages > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {/* Existing Images */}
          {existingImages.map((image) => (
            <div key={image.id} className="group relative aspect-square">
              <Image
                src={image.url}
                alt="Gallery image"
                fill
                className="rounded-lg border border-border object-cover transition-transform group-hover:scale-105"
              />

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {/* View Button */}
                <Button
                  onClick={() => setSelectedImage(image.url)}
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="size-8"
                >
                  <ZoomIn className="size-4" />
                </Button>

                {/* Remove Button */}
                <Button
                  onClick={() => handleRemoveExisting(image.id)}
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="size-8"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* New Files */}
          {files.map((fileItem) => (
            <div key={fileItem.id} className="group relative aspect-square">
              {isImage(fileItem.file) && fileItem.preview ? (
                <Image
                  src={fileItem.preview}
                  alt={fileItem.file.name}
                  fill
                  className="rounded-lg border border-border object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-lg border border-border bg-muted">
                  <ImageIcon className="size-8 text-muted-foreground" />
                </div>
              )}

              {/* Overlay */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 rounded-lg bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                {/* View Button */}
                {fileItem.preview && (
                  <Button
                    onClick={() => setSelectedImage(fileItem.preview!)}
                    type="button"
                    variant="secondary"
                    size="icon"
                    className="size-8"
                  >
                    <ZoomIn className="size-4" />
                  </Button>
                )}

                {/* Remove Button */}
                <Button
                  onClick={() => removeFile(fileItem.id)}
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="size-8"
                >
                  <X className="size-4" />
                </Button>
              </div>

              {/* File Info Badge */}
              <div className="absolute bottom-2 left-2 right-2 rounded-md bg-black/70 px-2 py-1 text-white opacity-0 transition-opacity group-hover:opacity-100">
                <p className="truncate text-xs font-medium">{fileItem.file.name}</p>
                <p className="text-xs text-gray-300">{formatBytes((fileItem.file as File).size)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" appearance="light" className="mt-4">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>File upload error(s)</AlertTitle>
            <AlertDescription>
              {errors.map((error, index) => (
                <p key={index} className="last:mb-0">
                  {error}
                </p>
              ))}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={selectedImage}
              alt="Preview"
              width={1200}
              height={800}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              onClick={() => setSelectedImage(null)}
              type="button"
              variant="secondary"
              size="icon"
              className="absolute top-2 right-2 size-8"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
