
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Edit3, Trash2, PlugZap, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

interface SshConnection {
  id: string;
  name: string;
  host: string;
  port: number;
  user: string;
  authMethod: 'password' | 'privateKey';
  keyType?: 'ed25519' | 'rsa' | 'dsa';
  privateKey?: string; // Store path or content
}

const initialConnections: SshConnection[] = [
  { id: '1', name: 'Dev Server', host: 'dev.example.com', port: 22, user: 'devuser', authMethod: 'privateKey', keyType: 'ed25519' },
  { id: '2', name: 'Prod Server', host: 'prod.example.com', port: 2222, user: 'admin', authMethod: 'privateKey', keyType: 'rsa' },
  { id: '3', name: 'Staging Server', host: '192.168.1.100', port: 22, user: 'staging', authMethod: 'password' },
];

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<SshConnection[]>(initialConnections);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConnection, setEditingConnection] = useState<SshConnection | null>(null);
  const { toast } = useToast();

  const handleConnect = (connection: SshConnection) => {
    toast({
      title: `Connecting to ${connection.name}...`,
      description: `Host: ${connection.host}:${connection.port}`,
    });
    // Router.push(`/terminal?sessionId=${connection.id}`); // Actual navigation
  };

  const handleDelete = (id: string) => {
    setConnections(connections.filter(conn => conn.id !== id));
    toast({
      title: 'Connection Deleted',
      description: 'The SSH connection has been removed.',
      variant: 'destructive'
    });
  };

  const handleSaveConnection = (connection: SshConnection) => {
    if (editingConnection) {
      setConnections(connections.map(c => c.id === connection.id ? connection : c));
      toast({ title: 'Connection Updated', description: `${connection.name} has been updated.`});
    } else {
      setConnections([...connections, { ...connection, id: String(Date.now()) }]);
      toast({ title: 'Connection Added', description: `${connection.name} has been added.`});
    }
    setEditingConnection(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="font-headline text-2xl">Manage SSH Connections</CardTitle>
            <CardDescription>Add, edit, or remove your server connections.</CardDescription>
          </div>
          <ConnectionFormDialog
            isOpen={isFormOpen}
            setIsOpen={setIsFormOpen}
            onSave={handleSaveConnection}
            connection={editingConnection}
            setEditingConnection={setEditingConnection}
            triggerButton={
              <Button onClick={() => { setEditingConnection(null); setIsFormOpen(true); }}>
                <PlusCircle className="mr-2 h-5 w-5" /> Add Connection
              </Button>
            }
          />
        </CardHeader>
        <CardContent>
          {connections.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No connections yet. Add your first server!</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Host</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Auth Method</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((conn) => (
                  <TableRow key={conn.id}>
                    <TableCell className="font-medium">{conn.name}</TableCell>
                    <TableCell>{conn.host}:{conn.port}</TableCell>
                    <TableCell>{conn.user}</TableCell>
                    <TableCell>{conn.authMethod === 'privateKey' ? `Key (${conn.keyType || 'N/A'})` : 'Password'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handleConnect(conn)}>
                        <PlugZap className="mr-1 h-4 w-4" /> Connect
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setEditingConnection(conn); setIsFormOpen(true); }}>
                        <Edit3 className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(conn.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface ConnectionFormDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onSave: (connection: SshConnection) => void;
  connection: SshConnection | null;
  setEditingConnection: (connection: SshConnection | null) => void;
  triggerButton?: React.ReactNode;
}

function ConnectionFormDialog({ isOpen, setIsOpen, onSave, connection, setEditingConnection, triggerButton }: ConnectionFormDialogProps) {
  const [name, setName] = useState('');
  const [host, setHost] = useState('');
  const [port, setPort] = useState<number>(22);
  const [user, setUser] = useState('');
  const [authMethod, setAuthMethod] = useState<'password' | 'privateKey'>('privateKey');
  const [keyType, setKeyType] = useState<'ed25519' | 'rsa' | 'dsa' | undefined>(undefined);
  const [privateKey, setPrivateKey] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    if (connection) {
      setName(connection.name);
      setHost(connection.host);
      setPort(connection.port);
      setUser(connection.user);
      setAuthMethod(connection.authMethod);
      setKeyType(connection.keyType);
      setPrivateKey(connection.privateKey || '');
      setPassword(''); // Don't prefill password
    } else {
      // Reset form for new connection
      setName(''); host(''); setPort(22); setUser(''); setAuthMethod('privateKey'); setKeyType(undefined); setPrivateKey(''); setPassword('');
    }
  }, [connection, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newConnection: SshConnection = {
      id: connection?.id || String(Date.now()), // Keep existing ID if editing
      name,
      host,
      port,
      user,
      authMethod,
      keyType: authMethod === 'privateKey' ? keyType : undefined,
      privateKey: authMethod === 'privateKey' ? privateKey : undefined,
      // Password is not stored, this is just for connection attempt.
      // For a real app, password storage would need secure handling or not be stored at all.
    };
    onSave(newConnection);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setEditingConnection(null);}}>
      {triggerButton && <DialogTrigger asChild>{triggerButton}</DialogTrigger>}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">{connection ? 'Edit Connection' : 'Add New Connection'}</DialogTitle>
          <DialogDescription>
            {connection ? 'Update the details for this SSH connection.' : 'Enter the details for your new SSH connection.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="conn-name">Connection Name</Label>
            <Input id="conn-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="My Web Server" required />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <Label htmlFor="conn-host">Hostname or IP</Label>
              <Input id="conn-host" value={host} onChange={(e) => setHost(e.target.value)} placeholder="server.example.com" required />
            </div>
            <div>
              <Label htmlFor="conn-port">Port</Label>
              <Input id="conn-port" type="number" value={port} onChange={(e) => setPort(Number(e.target.value))} placeholder="22" required />
            </div>
          </div>
          <div>
            <Label htmlFor="conn-user">Username</Label>
            <Input id="conn-user" value={user} onChange={(e) => setUser(e.target.value)} placeholder="root" required />
          </div>
          <div>
            <Label htmlFor="conn-auth">Authentication Method</Label>
            <Select value={authMethod} onValueChange={(value: 'password' | 'privateKey') => setAuthMethod(value)}>
              <SelectTrigger id="conn-auth">
                <SelectValue placeholder="Select auth method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="privateKey">Private Key</SelectItem>
                <SelectItem value="password">Password</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {authMethod === 'privateKey' && (
            <>
              <div>
                <Label htmlFor="conn-key-type">Key Type</Label>
                <Select value={keyType} onValueChange={(value: 'ed25519' | 'rsa' | 'dsa') => setKeyType(value)}>
                  <SelectTrigger id="conn-key-type">
                    <SelectValue placeholder="Select key type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ed25519">ED25519</SelectItem>
                    <SelectItem value="rsa">RSA</SelectItem>
                    <SelectItem value="dsa">DSA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="conn-private-key">Private Key</Label>
                <Textarea id="conn-private-key" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} placeholder="Paste your private key here or path to key (e.g., ~/.ssh/id_ed25519)" rows={4} className="font-code" />
                <p className="text-xs text-muted-foreground mt-1">For security, consider using a file path if your environment supports it. Pasting keys is less secure.</p>
              </div>
            </>
          )}
          {authMethod === 'password' && (
             <div className="relative">
              <Label htmlFor="conn-password">Password</Label>
              <Input 
                id="conn-password" 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Enter server password" 
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                className="absolute right-1 top-7 h-7 w-7"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => { setIsOpen(false); setEditingConnection(null); }}>Cancel</Button>
            <Button type="submit">{connection ? 'Save Changes' : 'Add Connection'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

