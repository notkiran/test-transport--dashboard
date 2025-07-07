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
  Users,
  Wallet,
} from 'lucide-react';
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Page } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'shipments', label: 'Shipments', icon: Package },
  { id: 'loading_sheets', label: 'Loading Sheets', icon: Sheet },
  { id: 'billing', label: 'Billing', icon: Wallet },
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

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={currentPage === item.id ? 'secondary' : 'ghost'}
                  className={cn("w-full justify-start", isCollapsed && "justify-center")}
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

        <div className="mt-auto p-4 border-t">
           <div className={cn("flex items-center", isCollapsed ? "justify-center" : "justify-between")}>
             {!isCollapsed && (
                <div className="flex items-center">
                    <img src="https://i.pravatar.cc/40?u=admin" alt="Admin" className="rounded-full" />
                    <div className="ml-3">
                        <p className="text-sm font-semibold">Admin User</p>
                        <p className="text-xs text-muted-foreground">admin@vahan.com</p>
                    </div>
                </div>
             )}
             <Bell className="h-5 w-5" />
           </div>
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
