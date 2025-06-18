"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { suggestCommand, type SuggestCommandInput, type SuggestCommandOutput } from '@/ai/flows/suggest-command';
import { Loader2, Wand2, Copy } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AiCommandSuggesterPage() {
  const [query, setQuery] = useState('');
  const [platform, setPlatform] = useState<string>('Linux');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<SuggestCommandOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({ title: 'Query is empty', description: 'Please describe the command you need.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setSuggestion(null);
    setError(null);

    try {
      const input: SuggestCommandInput = { query, platform };
      const result = await suggestCommand(input);
      setSuggestion(result);
    } catch (err) {
      console.error('AI Suggestion Error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to get suggestion: ${errorMessage}`);
      toast({ title: 'Error', description: `Could not fetch command suggestion. ${errorMessage}`, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCommand = () => {
    if (suggestion?.command) {
      navigator.clipboard.writeText(suggestion.command)
        .then(() => toast({ title: 'Copied!', description: 'Command copied to clipboard.' }))
        .catch(() => toast({ title: 'Copy Failed', description: 'Could not copy command.', variant: 'destructive' }));
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center"><Wand2 className="mr-2 h-6 w-6 text-primary" />AI Command Suggester</CardTitle>
          <CardDescription>Describe what you want to do, and let AI suggest the terminal command for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="query">Describe your task</Label>
              <Textarea
                id="query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., 'Find all .log files modified in the last 24 hours' or 'List all running docker containers'"
                rows={4}
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label htmlFor="platform">Target Platform</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger id="platform" className="mt-1">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Linux">Linux</SelectItem>
                  <SelectItem value="MacOS">MacOS</SelectItem>
                  <SelectItem value="Windows">Windows (PowerShell/CMD)</SelectItem>
                  <SelectItem value="Other">Other/Generic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Suggest Command
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
         <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {suggestion && (
        <Card className="mt-6 shadow-md">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Suggested Command</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Command:</Label>
              <div className="mt-1 p-3 bg-muted rounded-md font-code text-sm relative">
                <pre className="whitespace-pre-wrap break-all">{suggestion.command}</pre>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={handleCopyCommand}
                  aria-label="Copy command"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Explanation:</Label>
              <p className="mt-1 p-3 bg-muted/50 rounded-md text-sm whitespace-pre-line">{suggestion.explanation}</p>
            </div>
          </CardContent>
        </Card>
      )}
       {!isLoading && !suggestion && !error && (
        <Card className="mt-6 border-dashed">
          <CardContent className="p-10 text-center text-muted-foreground">
            <Wand2 className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Your AI-suggested command will appear here once you submit a query.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
