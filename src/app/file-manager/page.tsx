"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Folder, File, ArrowLeftRight, UploadCloud, DownloadCloud, Search, FolderUp, RefreshCcw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FileSystemItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  lastModified?: string;
}

const mockLocalFiles: FileSystemItem[] = [
  { id: 'l1', name: 'MyProject', type: 'folder', lastModified: '2023-10-26' },
  { id: 'l2', name: 'document.pdf', type: 'file', size: '1.2MB', lastModified: '2023-10-25' },
  { id: 'l3', name: 'image.jpg', type: 'file', size: '3.5MB', lastModified: '2023-10-24' },
  { id: 'l4', name: 'archive.zip', type: 'file', size: '10MB', lastModified: '2023-10-20' },
];

const mockRemoteFiles: FileSystemItem[] = [
  { id: 'r1', name: 'web-app', type: 'folder', lastModified: '2023-10-26' },
  { id: 'r2', name: 'server.log', type: 'file', size: '5.6MB', lastModified: '2023-10-25' },
  { id: 'r3', name: 'config.json', type: 'file', size: '1KB', lastModified: '2023-10-24' },
];

export default function FileManagerPage() {
  const [localPath, setLocalPath] = useState<string>('~/Documents');
  const [remotePath, setRemotePath] = useState<string>('/var/www/html');
  const [selectedLocalFiles, setSelectedLocalFiles] = useState<string[]>([]);
  const [selectedRemoteFiles, setSelectedRemoteFiles] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false); // Mock connection state

  const renderFileTable = (
    title: string,
    path: string,
    setPath: (p: string) => void,
    files: FileSystemItem[],
    selectedFiles: string[],
    setSelectedFiles: (ids: string[]) => void,
    isRemote = false
  ) => (
    <Card className="flex-1 flex flex-col min-w-0 h-full">
      <CardHeader className="py-3 px-4 border-b">
        <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-headline">{title}</CardTitle>
            {isRemote && !isConnected && <span className="text-xs text-destructive">Not Connected</span>}
            {isRemote && isConnected && <span className="text-xs text-green-400">Connected to MockServer</span>}
            {!isRemote && <Button variant="outline" size="sm" onClick={() => setIsConnected(!isConnected)}>{isConnected ? 'Disconnect Mock' : 'Connect Mock'}</Button>}
        </div>
        <div className="flex items-center gap-2 mt-2">
            <Button variant="ghost" size="icon" disabled={path.split('/').length <= 2 && path.startsWith('~/') || path === '/'} onClick={() => setPath(path.substring(0, path.lastIndexOf('/')) || (path.startsWith('~/') ? '~/' : '/'))}><FolderUp className="h-4 w-4"/></Button>
            <Input value={path} onChange={(e) => setPath(e.target.value)} className="h-8 text-sm flex-1" />
            <Button variant="ghost" size="icon"><RefreshCcw className="h-4 w-4"/></Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-muted/50">
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Last Modified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isRemote && !isConnected) ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10">Connect to a server to view remote files.</TableCell></TableRow>
              ) : files.length === 0 ? (
                <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-10">Folder is empty.</TableCell></TableRow>
              ) : (
                files.map((item) => (
                <TableRow
                  key={item.id}
                  onClick={() => {
                    const newSelected = selectedFiles.includes(item.id)
                      ? selectedFiles.filter(id => id !== item.id)
                      : [...selectedFiles, item.id];
                    setSelectedFiles(newSelected);
                  }}
                  className={`cursor-pointer ${selectedFiles.includes(item.id) ? 'bg-primary/10' : ''}`}
                >
                  <TableCell>
                    {item.type === 'folder' ? <Folder className="h-5 w-5 text-primary" /> : <File className="h-5 w-5 text-muted-foreground" />}
                  </TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.size || '-'}</TableCell>
                  <TableCell>{item.lastModified || '-'}</TableCell>
                </TableRow>
              )))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      <Card className="flex-shrink-0">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center"><ArrowLeftRight className="mr-3 h-6 w-6 text-primary" />Secure File Transfer (SCP)</CardTitle>
          <CardDescription>Transfer files between your local machine and remote servers.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center gap-4">
            <Button disabled={selectedLocalFiles.length === 0 || !isConnected}>
              <UploadCloud className="mr-2 h-5 w-5" /> Upload Selected ({selectedLocalFiles.length})
            </Button>
            <Button disabled={selectedRemoteFiles.length === 0 || !isConnected}>
              <DownloadCloud className="mr-2 h-5 w-5" /> Download Selected ({selectedRemoteFiles.length})
            </Button>
        </CardContent>
      </Card>

      <div className="flex-grow grid md:grid-cols-2 gap-6 min-h-0">
        {renderFileTable('Local Files', localPath, setLocalPath, mockLocalFiles, selectedLocalFiles, setSelectedLocalFiles)}
        {renderFileTable('Remote Files', remotePath, setRemotePath, mockRemoteFiles, selectedRemoteFiles, setSelectedRemoteFiles, true)}
      </div>
    </div>
  );
}
