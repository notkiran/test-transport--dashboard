import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ImageSource = { type: 'url'; value: string } | { type: 'file'; value: File; preview: string };

interface MultiPhotoUploadProps {
  label: string;
  existingImageUrls?: string[];
  onFilesChange: (files: File[]) => void;
  onRemoveExistingUrl?: (url: string) => void;
  isEditing: boolean;
  placeholderIcon: React.ReactNode;
  className?: string;
}

export function MultiPhotoUpload({
  label,
  existingImageUrls = [],
  onFilesChange,
  onRemoveExistingUrl,
  isEditing,
  placeholderIcon,
  className,
}: MultiPhotoUploadProps) {
  const [newFiles, setNewFiles] = useState<ImageSource[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Cleanup object URLs on unmount
    return () => {
      newFiles.forEach(file => {
        if (file.type === 'file') {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [newFiles]);
  
  useEffect(() => {
    if (!isEditing) {
        setNewFiles([]);
    }
  }, [isEditing]);

  const allImages: ImageSource[] = [
    ...existingImageUrls.map(url => ({ type: 'url', value: url } as ImageSource)),
    ...newFiles,
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    if (selectedFiles.length > 0) {
      const newImageSources: ImageSource[] = selectedFiles.map(file => ({
        type: 'file',
        value: file,
        preview: URL.createObjectURL(file),
      }));
      const updatedFiles = [...newFiles, ...newImageSources];
      setNewFiles(updatedFiles);
      onFilesChange(updatedFiles.filter(f => f.type === 'file').map(f => f.value as File));
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveImage = (imageToRemove: ImageSource, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (imageToRemove.type === 'file') {
      URL.revokeObjectURL(imageToRemove.preview);
      const updatedFiles = newFiles.filter(f => f !== imageToRemove);
      setNewFiles(updatedFiles);
      onFilesChange(updatedFiles.filter(f => f.type === 'file').map(f => f.value as File));
    } else if (imageToRemove.type === 'url' && onRemoveExistingUrl) {
      onRemoveExistingUrl(imageToRemove.value);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">{label}</label>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {allImages.map((image, index) => (
          <div key={image.type === 'file' ? image.preview : image.value} className="relative group aspect-square">
            <img
              src={image.type === 'file' ? image.preview : image.value}
              alt={`${label} ${index + 1}`}
              className="h-full w-full object-cover rounded-md bg-muted"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md">
                <Button size="icon" variant="destructive" onClick={(e) => handleRemoveImage(image, e)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Remove Image</span>
                </Button>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square border-2 border-dashed bg-muted/20 hover:border-primary/50 hover:bg-muted/40 transition-all flex flex-col items-center justify-center cursor-pointer rounded-md text-muted-foreground"
          >
            {allImages.length === 0 ? (
              <div className="text-center p-2">
                {placeholderIcon}
                <p className="mt-2 text-xs font-semibold">Upload {label}</p>
              </div>
            ) : (
              <>
                <PlusCircle className="h-8 w-8" />
                <p className="mt-2 text-sm">Add More</p>
              </>
            )}
          </button>
        )}
         {!isEditing && allImages.length === 0 && (
            <div className="aspect-square border-2 border-dashed bg-muted/20 flex flex-col items-center justify-center rounded-md text-muted-foreground p-2">
                {placeholderIcon}
                <p className="mt-2 text-xs text-center">No documents uploaded</p>
            </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        multiple
      />
    </div>
  );
}
