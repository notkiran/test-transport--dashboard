import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface PageHeaderProps {
  title: string;
  children?: React.ReactNode;
  showBackButton?: boolean;
  onBack?: () => void;
}

export function PageHeader({ title, children, showBackButton = false, onBack }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between space-y-2 pb-4">
      <div className="flex items-center gap-4">
        {showBackButton && onBack && (
          <Button variant="outline" size="icon" onClick={onBack} aria-label="Go back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        )}
        <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      <div className="flex items-center space-x-2">
        {children}
      </div>
    </div>
  );
}
