import { useState, useCallback, useRef } from 'react';

export interface FileMetadata {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
}

export interface FileWithPreview {
  id: string;
  file: File | FileMetadata;
  preview: string;
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

interface UseFileUploadOptions {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  initialFiles?: FileMetadata[];
  onFilesChange?: (files: FileWithPreview[]) => void;
}

interface UseFileUploadState {
  files: FileWithPreview[];
  isDragging: boolean;
  errors: string[];
}

export function useFileUpload({
  maxFiles = 1,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/*',
  multiple = false,
  initialFiles = [],
  onFilesChange,
}: UseFileUploadOptions) {
  const [state, setState] = useState<UseFileUploadState>({
    files: initialFiles.map(file => ({
      id: file.id,
      file,
      preview: file.url || '',
    })),
    isDragging: false,
    errors: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      if (accept !== '*') {
        const acceptedTypes = accept.split(',').map((type) => type.trim());
        const fileType = file.type;
        const isAccepted = acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            return fileType.startsWith(type.replace('/*', ''));
          }
          return fileType === type;
        });

        if (!isAccepted) {
          return `File type ${file.type} is not accepted. Accepted types: ${accept}`;
        }
      }

      if (file.size > maxSize) {
        const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
        return `File size exceeds ${maxSizeMB}MB limit`;
      }

      return null;
    },
    [accept, maxSize]
  );

  const processFiles = useCallback(
    (fileList: FileList | File[], currentFiles: FileWithPreview[]) => {
      const files = Array.from(fileList);
      const errors: string[] = [];
      const validFiles: FileWithPreview[] = [];
      const totalFiles = currentFiles.length + files.length;
      if (totalFiles > maxFiles) {
        errors.push(`Maximum ${maxFiles} file(s) allowed`);
        return { validFiles: [], errors };
      }

      files.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(error);
        } else {
          validFiles.push({
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            preview: URL.createObjectURL(file),
          });
        }
      });

      return { validFiles, errors };
    },
    [maxFiles, validateFile]
  );

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setState((prev) => ({ ...prev, isDragging: false }));

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        setState((prev) => {
          const { validFiles, errors } = processFiles(files, prev.files);
          const newFiles = [...prev.files, ...validFiles];
          onFilesChange?.(newFiles);
          return { ...prev, files: newFiles, errors };
        });
      }
    },
    [processFiles, onFilesChange]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setState((prev) => {
          const { validFiles, errors } = processFiles(files, prev.files);
          const newFiles = [...prev.files, ...validFiles];
          onFilesChange?.(newFiles);
          return { ...prev, files: newFiles, errors };
        });
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [processFiles, onFilesChange]
  );

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const getInputProps = useCallback(
    () => ({
      ref: fileInputRef,
      type: 'file' as const,
      accept,
      multiple,
      onChange: handleFileChange,
    }),
    [accept, multiple, handleFileChange]
  );

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const newFiles = prev.files.filter((f) => f.id !== id);
        onFilesChange?.(newFiles);
        return { ...prev, files: newFiles };
      });
    },
    [onFilesChange]
  );

  const clearFiles = useCallback(() => {
    setState((prev) => {
      onFilesChange?.([]);
      return { ...prev, files: [], errors: [] };
    });
  }, [onFilesChange]);

  return [
    state,
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
  ] as const;
}
