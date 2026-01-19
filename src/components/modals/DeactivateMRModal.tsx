import React, { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import { AlertTriangle } from 'lucide-react';

interface DeactivateMRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mr: User | null;
  onConfirm: (mrId: string, reason: string) => void;
  action: 'deactivate' | 'activate';
}

export const DeactivateMRModal: React.FC<DeactivateMRModalProps> = ({
  open,
  onOpenChange,
  mr,
  onConfirm,
  action,
}) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    if (mr) {
      onConfirm(mr.id, reason);
      setReason('');
      onOpenChange(false);
    }
  };

  const isDeactivate = action === 'deactivate';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${isDeactivate ? 'bg-destructive/10' : 'bg-success/10'}`}>
              <AlertTriangle className={`h-5 w-5 ${isDeactivate ? 'text-destructive' : 'text-success'}`} />
            </div>
            <AlertDialogTitle>
              {isDeactivate ? 'Deactivate MR Account' : 'Reactivate MR Account'}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="pt-2">
            {isDeactivate ? (
              <>
                Are you sure you want to deactivate <strong>{mr?.name}</strong>?
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• MR will be immediately logged out</li>
                  <li>• MR cannot log in until reactivated</li>
                  <li>• All historical data will be preserved</li>
                </ul>
              </>
            ) : (
              <>
                Are you sure you want to reactivate <strong>{mr?.name}</strong>?
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• MR will be able to log in again</li>
                  <li>• Previous data and tasks will be accessible</li>
                </ul>
              </>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {isDeactivate && (
          <div className="space-y-2 py-2">
            <Label htmlFor="reason">Reason (optional)</Label>
            <Textarea
              id="reason"
              placeholder="Enter reason for deactivation..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setReason('')}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className={isDeactivate ? 'bg-destructive hover:bg-destructive/90' : 'bg-success hover:bg-success/90'}
          >
            {isDeactivate ? 'Deactivate MR' : 'Reactivate MR'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
