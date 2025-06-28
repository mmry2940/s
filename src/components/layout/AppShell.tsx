
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Home, Server, TerminalSquare, Cpu, FolderOpenDot, ListTree, History, Settings, BotMessageSquare } from 'lucide-react';
import Logo from '@/components/icons/Logo';
import { SheetTitle } from '../ui/sheet';

const navItems = [
  { href: '/', label: 'Dashboard', icon: Home },
  { href: '/connections', label: 'Connections', icon: Server },
  { href: '/terminal', label: 'Terminal', icon: TerminalSquare },
  { href: '/ai-command-suggester', label: 'AI Commands', icon: BotMessageSquare },
  { href: '/file-manager', label: 'File Manager', icon: FolderOpenDot },
  { href: '/package-manager', label: 'Package Manager', icon: ListTree },
  { href: '/command-history', label: 'Command History', icon: History },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1">
          <AppHeader />
          <ScrollArea className="flex-1">
            <main className="p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </ScrollArea>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}

function AppHeader() {
  const { isMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      {isMobile && <SidebarTrigger />}
      {!isMobile && <div className="w-8"></div>} {/* Spacer to align with sidebar toggle potential */}
      <h1 className="text-lg font-semibold md:text-xl">Remote Functions</h1>
      <div className="ml-auto flex items-center gap-2">
        {/* Placeholder for future actions like user profile or settings */}
        <Button variant="ghost" size="icon" aria-label="Settings">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}

function AppSidebar() {
  const pathname = usePathname();
  const { open, setOpen, isMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
    }
  };
  
  return (
    <Sidebar collapsible="icon" className="border-r">
       <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
      <SidebarHeader className="flex items-center justify-between p-2">
        <Link href="/" className="flex items-center gap-2 p-2" onClick={handleLinkClick}>
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Remote Functions</span>
        </Link>
        {!isMobile && <SidebarTrigger className="group-data-[collapsible=icon]:hidden" />}
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <ScrollArea className="h-full">
          <SidebarMenu className="p-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))}
                  tooltip={item.label}
                  onClick={handleLinkClick}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="p-2">
        {/* Placeholder for footer content if needed */}
      </SidebarFooter>
    </Sidebar>
  );
}
