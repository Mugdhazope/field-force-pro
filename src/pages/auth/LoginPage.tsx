import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, User, ShieldCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('mr');
  const [isLoading, setIsLoading] = useState(false);
  const { login, company } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password, selectedRole);
      if (success) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully logged in.',
        });
        navigate(selectedRole === 'mr' ? '/mr/dashboard' : '/admin/dashboard');
      } else {
        toast({
          title: 'Login failed',
          description: 'Invalid username or password. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/30 p-4">
      <div className="w-full max-w-md">
        {/* Company Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-primary text-primary-foreground text-2xl font-bold mb-4 shadow-lg">
            R
          </div>
          <h1 className="text-2xl font-bold text-foreground">{company.name}</h1>
          <p className="text-muted-foreground mt-1">Field Force Management Platform</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle>Sign In</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)} className="mb-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="mr" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  MR Login
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Login
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>

            {/* Demo Credentials Hint */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
              <div className="text-xs text-muted-foreground space-y-1">
                <p><strong>Admin:</strong> username: admin</p>
                <p><strong>MR:</strong> username: mr_amit, mr_priya, mr_vikram</p>
                <p className="text-muted-foreground/70">(any password works for demo)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          © 2025 {company.name}. All rights reserved.
        </p>
      </div>
    </div>
  );
};
