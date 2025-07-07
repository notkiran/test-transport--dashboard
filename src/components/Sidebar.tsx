import {
  Bell,
  Building2,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Package,
  Sheet,
  Truck,
  User,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Page } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'shipments', label: 'Shipments', icon: Package },
  { id: 'loading_sheets', label: 'Loading Sheets', icon: Sheet },
  { id: 'billing', label: 'Billing', icon: User }, // Changed icon for variety
  { id: 'fleet', label: 'Fleet', icon: Truck },
  { id: 'drivers', label: 'Drivers', icon: User },
  { id: 'branches', label: 'Branches', icon: Building2 },
];

export function Sidebar({ currentPage, setPage }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          'relative flex flex-col h-screen bg-card border-r transition-all duration-300 ease-in-out no-print',
          isCollapsed ? 'w-20' : 'w-64'
        )}
      >
        <div className={cn("flex items-center h-16 border-b px-6", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && <span className="text-lg font-bold text-primary">Vahan Sarthi</span>}
           <Truck className={cn("text-primary", isCollapsed && "h-6 w-6")} />
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={currentPage === item.id ? 'secondary' : 'ghost'}
                  className={cn("w-full justify-start h-10", isCollapsed && "justify-center")}
                  onClick={() => setPage(item.id as Page)}
                >
                  <item.icon className={cn("h-5 w-5", !isCollapsed && "mr-4")} />
                  {!isCollapsed && item.label}
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          ))}
        </nav>

        <div className="mt-auto border-t p-4">
          {isCollapsed ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                      <Bell className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">Notifications</TooltipContent>
                </Tooltip>
                <ThemeToggle />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="flex items-center justify-center">
                    <img
                      src="https://i.pravatar.cc/40?u=admin"
                      alt="Admin"
                      className="rounded-full"
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p className="font-semibold">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@vahan.com</p>
                </TooltipContent>
              </Tooltip>
            </div>
          ) : (
            <div>
              <button className="flex items-center w-full text-left p-2 rounded-lg hover:bg-muted transition-colors">
                <img
                  src="https://i.pravatar.cc/40?u=admin"
                  alt="Admin"
                  className="rounded-full flex-shrink-0"
                />
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-semibold">Admin User</p>
                  <p className="text-xs text-muted-foreground">
                    admin@vahan.com
                  </p>
                </div>
              </button>
              <div className="flex items-center justify-between mt-4">
                 <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
                      <Bell className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Notifications</TooltipContent>
                </Tooltip>
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>

        <Button
          onClick={toggleSidebar}
          variant="outline"
          size="icon"
          className="absolute -right-4 top-16 h-8 w-8 rounded-full"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </TooltipProvider>
  );
}
