"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { HardDriveDownload, HardDriveUpload, Maximize, Minimize, Power, AlertTriangle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error' | 'system';
  text: string;
  timestamp: Date;
}

const MOCK_SERVER_NAME = "example-server-01";
const MOCK_USER = "pilot";

export default function TerminalPage() {
  const [currentTab, setCurrentTab] = useState("session-1");
  const [isFullscreen, setIsFullscreen] = useState(false);

  // For a real app, each tab would have its own state (lines, input, etc.)
  // Here, we'll use a single state for simplicity for the active tab.
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: Date.now(), type: 'system', text: `Connecting to ${MOCK_SERVER_NAME}...`, timestamp: new Date() },
    { id: Date.now() + 1, type: 'system', text: `Connected! Welcome, ${MOCK_USER}.`, timestamp: new Date() },
    { id: Date.now() + 2, type: 'output', text: `${MOCK_USER}@${MOCK_SERVER_NAME}:~$ `, timestamp: new Date() },
  ]);
  const [input, setInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Scroll to bottom when new lines are added
    if (scrollAreaRef.current) {
      const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
      }
    }
  }, [lines]);
  
  useEffect(() => {
    // Focus input on tab change or initial load
    inputRef.current?.focus();
  }, [currentTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === '') {
       setLines(prev => [...prev, { id: Date.now(), type: 'output', text: `${MOCK_USER}@${MOCK_SERVER_NAME}:~$ `, timestamp: new Date() }]);
       return;
    }

    const newLines: TerminalLine[] = [
      ...lines,
      { id: Date.now(), type: 'input', text: input, timestamp: new Date() },
    ];

    // Mock command execution
    let outputText = '';
    if (input.trim().toLowerCase() === 'ls') {
      outputText = 'Documents  Downloads  Pictures  Music  Desktop';
    } else if (input.trim().toLowerCase() === 'pwd') {
      outputText = `/home/${MOCK_USER}`;
    } else if (input.trim().toLowerCase() === 'date') {
      outputText = new Date().toString();
    } else if (input.trim().toLowerCase().startsWith('echo ')) {
      outputText = input.substring(5);
    } else if (input.trim().toLowerCase() === 'clear') {
       setLines([{ id: Date.now(), type: 'output', text: `${MOCK_USER}@${MOCK_SERVER_NAME}:~$ `, timestamp: new Date() }]);
       setInput('');
       return;
    }
    else {
      outputText = `command not found: ${input}`;
      newLines.push({ id: Date.now() + 1, type: 'error', text: outputText, timestamp: new Date() });
    }

    if (outputText && !newLines.find(l => l.type === 'error')) {
      newLines.push({ id: Date.now() + 1, type: 'output', text: outputText, timestamp: new Date() });
    }
    
    newLines.push({ id: Date.now() + 2, type: 'output', text: `${MOCK_USER}@${MOCK_SERVER_NAME}:~$ `, timestamp: new Date() });

    setLines(newLines);
    setInput('');
  };

  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  return (
    <div className={`transition-all duration-300 ease-in-out ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : 'relative'}`}>
      <Card className={`flex flex-col h-[calc(100vh-10rem)] ${isFullscreen ? 'h-screen border-none rounded-none' : ''}`}>
        <CardHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-headline text-xl">Interactive Shell</CardTitle>
              <CardDescription>Direct command line access to your server. Current session: {MOCK_SERVER_NAME}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={toggleFullscreen}>
                {isFullscreen ? <Minimize className="h-4 w-4 mr-1" /> : <Maximize className="h-4 w-4 mr-1" />}
                {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              </Button>
              <Button variant="destructive" size="sm">
                <Power className="h-4 w-4 mr-1" /> Disconnect
              </Button>
            </div>
          </div>
           <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-2">
            <TabsList>
              <TabsTrigger value="session-1">{MOCK_SERVER_NAME}</TabsTrigger>
              <TabsTrigger value="session-2" disabled>Server 2 (mock)</TabsTrigger>
              <TabsTrigger value="new-session" disabled>+</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="flex-grow p-0">
          <TabsContent value={currentTab} className="h-full mt-0">
            <ScrollArea ref={scrollAreaRef} className="h-[calc(100%-4rem)] w-full">
              <div className="p-4 space-y-2 font-code text-sm">
                {lines.map((line) => (
                  <div key={line.id} className="flex">
                    {line.type === 'input' && <span className="text-primary mr-1">{MOCK_USER}@{MOCK_SERVER_NAME}:~$</span>}
                    <span
                      className={
                        line.type === 'error' ? 'text-destructive' :
                        line.type === 'system' ? 'text-accent' :
                        line.type === 'input' ? 'text-primary-foreground' : // Or another color for user input
                        'text-foreground' // Default for output
                      }
                      style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}
                    >
                      {line.text}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <form onSubmit={handleCommandSubmit} className="border-t p-2">
              <div className="flex items-center gap-2">
                <span className="font-code text-sm text-primary">{MOCK_USER}@{MOCK_SERVER_NAME}:~$</span>
                <Input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your command here..."
                  className="flex-1 bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 font-code text-sm"
                  autoComplete="off"
                  spellCheck="false"
                  aria-label="Command input"
                />
                <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">Send</Button>
              </div>
            </form>
          </TabsContent>
        </CardContent>
      </Card>
      {isFullscreen && 
        <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFullscreen} 
            className="fixed top-4 right-4 z-50"
            aria-label="Exit Fullscreen"
        >
            <Minimize className="h-4 w-4 mr-1" /> Exit Fullscreen
        </Button>
      }
    </div>
  );
}
