import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, RefreshCw, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';

interface AddMRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMRAdded: (mr: User) => void;
}

const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  let password = '';
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const AddMRModal: React.FC<AddMRModalProps> = ({
  open,
  onOpenChange,
  onMRAdded,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: generatePassword(),
    headquarters: '',
    email: '',
    phone: '',
  });

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(formData.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Password Copied',
      description: 'Password has been copied to clipboard',
    });
  };

  const handleRegeneratePassword = () => {
    setFormData({ ...formData, password: generatePassword() });
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.username.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Name and username are required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newMR: User = {
      id: `user-${Date.now()}`,
      name: formData.name,
      username: formData.username,
      role: 'mr',
      headquarters: formData.headquarters || 'HQ',
      email: formData.email || `${formData.username}@company.com`,
      phone: formData.phone,
      isActive: true,
      companyId: 'comp-001',
      createdAt: new Date().toISOString(),
    };

    onMRAdded(newMR);
    
    toast({
      title: 'MR Account Created',
      description: `${formData.name} can now log in with username: ${formData.username}`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      password: generatePassword(),
      headquarters: '',
      email: '',
      phone: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New MR</DialogTitle>
          <DialogDescription>
            Create a new Medical Representative account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Amit Sharma"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              placeholder="e.g., mr_amit"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, '_') })}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex gap-2">
              <Input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopyPassword}
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleRegeneratePassword}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Auto-generated password. Click copy to save it.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headquarters">Headquarters / Region</Label>
            <Input
              id="headquarters"
              placeholder="e.g., Mumbai Central"
              value={formData.headquarters}
              onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create MR'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
