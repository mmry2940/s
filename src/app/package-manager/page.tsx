"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListTree, Search, RotateCcw, Box, CheckCircle, HelpCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface PackageInfo {
  id: string;
  name: string;
  version: string;
  description: string;
  status?: 'installed' | 'available' | 'unknown';
}

const mockPackages: PackageInfo[] = [
  { id: '1', name: 'nginx', version: '1.25.3', description: 'High-performance web server', status: 'installed' },
  { id: '2', name: 'docker-ce', version: '24.0.7', description: 'Docker Community Edition', status: 'installed' },
  { id: '3', name: 'python3', version: '3.10.12', description: 'Interpreter for the Python programming language', status: 'installed' },
  { id: '4', name: 'nodejs', version: '18.18.2', description: 'JavaScript runtime built on Chrome V8 engine', status: 'installed' },
  { id: '5', name: 'htop', version: '3.2.2', description: 'Interactive process viewer', status: 'available' },
  { id: '6', name: 'git', version: '2.39.2', description: 'Distributed version control system', status: 'installed' },
  { id: '7', name: 'vim', version: '9.0.1672', description: 'Highly configurable text editor', status: 'unknown' },
];

export default function PackageManagerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [packages, setPackages] = useState<PackageInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false); // Mock connection state
  const [filterStatus, setFilterStatus] = useState<string>('all');


  useEffect(() => {
    // Simulate fetching packages after connection
    if (isConnected) {
      setIsLoading(true);
      setTimeout(() => {
        setPackages(mockPackages);
        setIsLoading(false);
      }, 1000);
    } else {
      setPackages([]);
      setIsLoading(false);
    }
  }, [isConnected]);

  const filteredPackages = packages.filter(pkg =>
    (pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     pkg.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filterStatus === 'all' || pkg.status === filterStatus)
  );

  const handleRefresh = () => {
    if (isConnected) {
      setIsLoading(true);
      setTimeout(() => {
        // Potentially fetch new data or shuffle mock data
        setPackages([...mockPackages].sort(() => Math.random() - 0.5));
        setIsLoading(false);
      }, 1000);
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="font-headline text-2xl flex items-center"><ListTree className="mr-3 h-6 w-6 text-primary" />Remote Package Manager</CardTitle>
              <CardDescription>View and manage installed software packages on the connected server.</CardDescription>
            </div>
             <Button onClick={() => setIsConnected(!isConnected)} variant={isConnected ? "destructive" : "default"}>
              {isConnected ? 'Disconnect from MockServer' : 'Connect to MockServer'}
            </Button>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search packages by name or description..."
                className="pl-8 sm:w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                disabled={!isConnected}
              />
            </div>
             <Select value={filterStatus} onValueChange={setFilterStatus} disabled={!isConnected}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="installed">Installed</SelectItem>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            <Button onClick={handleRefresh} disabled={!isConnected || isLoading} variant="outline">
              <RotateCcw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!isConnected ? (
             <div className="text-center py-10 text-muted-foreground">
              <Box className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Please connect to a server to view and manage packages.</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 p-2 border-b">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                   <Skeleton className="h-8 w-24" />
                </div>
              ))}
            </div>
          ) : filteredPackages.length === 0 ? (
            <p className="text-muted-foreground text-center py-10">No packages found matching your criteria.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Version</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPackages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell>
                      {pkg.status === 'installed' && <CheckCircle className="h-5 w-5 text-green-500" title="Installed"/>}
                      {pkg.status === 'available' && <Box className="h-5 w-5 text-blue-500" title="Available"/>}
                      {pkg.status === 'unknown' && <HelpCircle className="h-5 w-5 text-muted-foreground" title="Unknown Status"/>}
                    </TableCell>
                    <TableCell className="font-medium">{pkg.name}</TableCell>
                    <TableCell>{pkg.version}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-xs truncate">{pkg.description}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" disabled>Details</Button> 
                      {/* Add install/uninstall buttons in a real app */}
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
