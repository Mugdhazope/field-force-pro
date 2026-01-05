import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 
  | 'pending' 
  | 'approved' 
  | 'rejected' 
  | 'completed' 
  | 'overdue' 
  | 'present' 
  | 'absent' 
  | 'half-day'
  | 'active'
  | 'inactive';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  pending: {
    label: 'Pending',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  approved: {
    label: 'Approved',
    className: 'bg-success/10 text-success border-success/20',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  completed: {
    label: 'Completed',
    className: 'bg-success/10 text-success border-success/20',
  },
  overdue: {
    label: 'Overdue',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  present: {
    label: 'Present',
    className: 'bg-success/10 text-success border-success/20',
  },
  absent: {
    label: 'Absent',
    className: 'bg-destructive/10 text-destructive border-destructive/20',
  },
  'half-day': {
    label: 'Half Day',
    className: 'bg-warning/10 text-warning border-warning/20',
  },
  active: {
    label: 'Active',
    className: 'bg-success/10 text-success border-success/20',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-muted text-muted-foreground border-muted',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const config = statusConfig[status];

  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
};
