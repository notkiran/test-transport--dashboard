import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  label: string;
  imageUrl: string | null | undefined;
  onImageChange: (file: File | null) => void;
  isEditing: boolean;
  placeholderIcon: React.ReactNode;
  className?: string;
  aspect?: 'aspect-video' | 'aspect-square';
  rounded?: 'rounded-md' | 'rounded-full';
}

export function PhotoUpload({ 
  label, 
  imageUrl, 
  onImageChange, 
  isEditing, 
  placeholderIcon, 
  className,
  aspect = 'aspect-video',
  rounded = 'rounded-md'
}: PhotoUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const effectiveImageUrl = previewUrl || imageUrl;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      onImageChange(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    onImageChange(null);
  };

  const triggerFileSelect = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{label}</label>
      <Card 
        className={cn(
          "overflow-hidden transition-all", 
          isEditing ? "border-primary/50 ring-1 ring-primary/20" : "border-dashed bg-muted/20",
          rounded
        )}
      >
        <CardContent className="p-2">
          <div 
            className={cn(
              "relative group flex items-center justify-center bg-background/50 overflow-hidden",
              isEditing ? "cursor-pointer" : "cursor-default",
              aspect,
              rounded
            )}
            onClick={() => isEditing && fileInputRef.current?.click()}
          >
            {effectiveImageUrl ? (
              <img src={effectiveImageUrl} alt={label} className="h-full w-full object-cover" />
            ) : (
              <div className="text-muted-foreground">{placeholderIcon}</div>
            )}

            {isEditing && (
              <div className={cn(
                "absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                rounded
              )}>
                <div className="flex items-center space-x-2">
                  <Button size="icon" variant="secondary" onClick={triggerFileSelect}>
                    <Upload className="h-5 w-5" />
                    <span className="sr-only">Upload Image</span>
                  </Button>
                  {effectiveImageUrl && (
                    <Button size="icon" variant="destructive" onClick={handleRemoveImage}>
                      <X className="h-5 w-5" />
                      <span className="sr-only">Remove Image</span>
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
    </div>
  );
}
