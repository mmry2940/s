"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, BotMessageSquare, ServerCog } from 'lucide-react';
import Image from 'next/image';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-headline">Welcome to Remote Functions</CardTitle>
          <CardDescription>Your intelligent assistant for managing remote servers efficiently and securely.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-6 text-muted-foreground">
            Connect to your servers, run commands with AI assistance, manage files, and monitor applications, all from one place.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/connections" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <ServerCog className="mr-3 h-6 w-6 text-primary" />
                <div>
                  <p className="font-semibold">Manage Connections</p>
                  <p className="text-sm text-muted-foreground">Add, edit, and connect to your SSH servers.</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5" />
              </Button>
            </Link>
            <Link href="/ai-command-suggester" passHref>
              <Button variant="outline" className="w-full justify-start text-left h-auto py-3">
                <BotMessageSquare className="mr-3 h-6 w-6 text-accent" />
                <div>
                  <p className="font-semibold">AI Command Suggester</p>
                  <p className="text-sm text-muted-foreground">Get command suggestions from natural language.</p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Interactive Terminal</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x400.png" alt="Interactive Terminal Preview" width={600} height={400} className="rounded-md object-cover" data-ai-hint="terminal interface" />
            <p className="mt-2 text-sm text-muted-foreground">A powerful, responsive terminal emulator for direct server interaction.</p>
            <Link href="/terminal" passHref>
              <Button variant="link" className="px-0 mt-2">Go to Terminal <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Secure File Transfers</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x400.png" alt="File Transfer Preview" width={600} height={400} className="rounded-md object-cover" data-ai-hint="file manager" />
            <p className="mt-2 text-sm text-muted-foreground">Easily transfer files to and from remote servers using SCP.</p>
            <Link href="/file-manager" passHref>
              <Button variant="link" className="px-0 mt-2">Open File Manager <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Package Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Image src="https://placehold.co/600x400.png" alt="Package Management Preview" width={600} height={400} className="rounded-md object-cover" data-ai-hint="software list" />
            <p className="mt-2 text-sm text-muted-foreground">View and manage installed software packages on your remote servers.</p>
            <Link href="/package-manager" passHref>
              <Button variant="link" className="px-0 mt-2">View Packages <ArrowRight className="ml-1 h-4 w-4" /></Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
