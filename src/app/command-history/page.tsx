"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Search, Copy, Play, Trash2, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CommandHistoryItem {
  id: string;
  command: string;
  timestamp: Date;
  serverName: string; // To associate with a session/server
  status: 'success' | 'error' | 'running';
}

const mockHistory: CommandHistoryItem[] = [
  { id: '1', command: 'ls -la', timestamp: new Date(Date.now() - 1000 * 60 * 5), serverName: 'dev-server', status: 'success' },
  { id: '2', command: 'docker ps', timestamp: new Date(Date.now() - 1000 * 60 * 10), serverName: 'dev-server', status: 'success' },
  { id: '3', command: 'git status', timestamp: new Date(Date.now() - 1000 * 60 * 15), serverName: 'prod-server', status: 'success' },
  { id: '4', command: 'npm run build', timestamp: new Date(Date.now() - 1000 * 60 * 20), serverName: 'local-dev', status: 'error' },
  { id: '5', command: 'sudo apt update && sudo apt upgrade -y', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), serverName: 'dev-server', status: 'success' },
  { id: '6', command: 'cat /var/log/syslog | grep ERROR', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), serverName: 'prod-server', status: 'success' },
];

export default function CommandHistoryPage() {
  const [history, setHistory] = useState<CommandHistoryItem[]>(mockHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [serverFilter, setServerFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const serverNames = useMemo(() => ['all', ...Array.from(new Set(mockHistory.map(item => item.serverName)))], []);

  const filteredHistory = history.filter(item =>
    item.command.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (serverFilter === 'all' || item.serverName === serverFilter) &&
    (statusFilter === 'all' || item.status === statusFilter)
  ).sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime());

  const handleCopyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
      .then(() => toast({ title: 'Copied!', description: 'Command copied to clipboard.' }))
      .catch(() => toast({ title: 'Copy Failed', variant: 'destructive' }));
  };

  const handleRerunCommand = (command: string) => {
    // In a real app, this would send the command to the active terminal
    toast({ title: 'Re-run Command', description: `Sent "${command}" to terminal (mock).` });
  };
  
  const handleDeleteCommand = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast({ title: 'Command Removed', description: 'Command removed from history.', variant: 'destructive'});
  };

  const handleClearHistory = () => {
    setHistory([]);
    toast({ title: 'History Cleared', description: 'All commands removed from history.', variant: 'destructive'});
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-2xl flex items-center"><History className="mr-3 h-6 w-6 text-primary" />Command History</CardTitle>
              <CardDescription>Review and reuse commands executed across your sessions.</CardDescription>
            </div>
            <Button variant="destructive" onClick={handleClearHistory} disabled={history.length === 0}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear All History
            </Button>
          </div>
           <div className="mt-4 flex flex-col md:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search commands..."
                className="pl-8 sm:w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={serverFilter} onValueChange={setServerFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by server..." />
              </SelectTrigger>
              <SelectContent>
                {serverNames.map(name => <SelectItem key={name} value={name}>{name === 'all' ? 'All Servers' : name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filter by status..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="error">Error</SelectItem>
                <SelectItem value="running">Running</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">
              {history.length === 0 ? "No command history available." : "No commands match your current filters."}
            </p>
          ) : (
            <ScrollArea className="h-[calc(100vh-22rem)]"> {/* Adjust height as needed */}
              <ul className="space-y-3">
                {filteredHistory.map((item) => (
                  <li key={item.id} className="p-3 border rounded-md hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="font-code text-sm truncate text-primary-foreground" title={item.command}>{item.command}</p>
                        <p className="text-xs text-muted-foreground">
                          On <span className="font-medium text-accent">{item.serverName}</span> &bull; {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                           &bull; Status: <span className={
                             item.status === 'success' ? 'text-green-400' :
                             item.status === 'error' ? 'text-red-400' :
                             'text-yellow-400'
                           }>{item.status}</span>
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => handleCopyCommand(item.command)} title="Copy command">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleRerunCommand(item.command)} title="Re-run command (mock)">
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteCommand(item.id)} title="Delete from history">
                          <Trash2 className="h-4 w-4 text-destructive/80 hover:text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
