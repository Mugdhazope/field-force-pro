import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Users, Plus, MoreVertical, UserX, UserCheck, Eye, Clock } from 'lucide-react';
import { mockUsers } from '@/lib/mock-data';
import { User } from '@/types';
import { AddMRModal, DeactivateMRModal } from '@/components/modals';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { format, formatDistanceToNow } from 'date-fns';

export const AdminMRsPage: React.FC = () => {
  const navigate = useNavigate();
  const { updateUserStatus } = useAuth();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedMR, setSelectedMR] = useState<User | null>(null);
  const [actionType, setActionType] = useState<'deactivate' | 'activate'>('deactivate');

  const mrs = users.filter(u => u.role === 'mr');

  const handleMRAdded = (mr: User) => {
    setUsers(prev => [...prev, mr]);
  };

  const handleDeactivateClick = (mr: User) => {
    setSelectedMR(mr);
    setActionType('deactivate');
    setShowDeactivateModal(true);
  };

  const handleActivateClick = (mr: User) => {
    setSelectedMR(mr);
    setActionType('activate');
    setShowDeactivateModal(true);
  };

  const handleStatusChange = (mrId: string, reason: string) => {
    const isActivating = actionType === 'activate';
    
    setUsers(prev => prev.map(u => {
      if (u.id === mrId) {
        return {
          ...u,
          isActive: isActivating,
          deactivatedAt: isActivating ? undefined : new Date().toISOString(),
          deactivationReason: isActivating ? undefined : reason,
        };
      }
      return u;
    }));

    // Update in auth context (simulates server-side update)
    updateUserStatus(mrId, isActivating, reason);

    toast.success(
      isActivating 
        ? `${selectedMR?.name} has been reactivated` 
        : `${selectedMR?.name} has been deactivated`
    );
  };

  const columns = [
    { 
      key: 'name', 
      header: 'Name',
      priority: 1,
      render: (item: User) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.name}</span>
          <span className="text-xs text-muted-foreground">@{item.username}</span>
        </div>
      )
    },
    { 
      key: 'headquarters', 
      header: 'Headquarters',
      priority: 3,
      hideOnMobile: true,
    },
    { 
      key: 'phone', 
      header: 'Phone',
      priority: 4,
      hideOnMobile: true,
    },
    { 
      key: 'lastActiveAt', 
      header: 'Last Active',
      priority: 5,
      hideOnMobile: true,
      render: (item: User) => (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="h-3 w-3" />
          {item.lastActiveAt 
            ? formatDistanceToNow(new Date(item.lastActiveAt), { addSuffix: true })
            : 'Never'}
        </div>
      )
    },
    { 
      key: 'isActive', 
      header: 'Status', 
      priority: 2,
      render: (item: User) => (
        <div className="flex flex-col gap-1">
          <StatusBadge status={item.isActive ? 'active' : 'inactive'} />
          {!item.isActive && item.deactivatedAt && (
            <span className="text-xs text-muted-foreground">
              Revoked {format(new Date(item.deactivatedAt), 'dd MMM yyyy')}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      priority: 1,
      render: (item: User) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => navigate(`/admin/mr/${item.id}`)}>
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {item.isActive ? (
              <DropdownMenuItem 
                onClick={() => handleDeactivateClick(item)}
                className="text-destructive focus:text-destructive"
              >
                <UserX className="h-4 w-4 mr-2" />
                Deactivate MR
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                onClick={() => handleActivateClick(item)}
                className="text-success focus:text-success"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Reactivate MR
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  const activeMRs = mrs.filter(m => m.isActive).length;
  const inactiveMRs = mrs.filter(m => !m.isActive).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="MR Management" 
        description="Manage medical representatives and access control" 
        icon={Users} 
        actions={
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add MR
          </Button>
        } 
      />

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="outline" className="px-3 py-1.5 text-sm">
          <span className="text-muted-foreground mr-1">Total:</span>
          <span className="font-semibold">{mrs.length}</span>
        </Badge>
        <Badge variant="outline" className="px-3 py-1.5 text-sm bg-success/5 border-success/20">
          <span className="text-muted-foreground mr-1">Active:</span>
          <span className="font-semibold text-success">{activeMRs}</span>
        </Badge>
        {inactiveMRs > 0 && (
          <Badge variant="outline" className="px-3 py-1.5 text-sm bg-destructive/5 border-destructive/20">
            <span className="text-muted-foreground mr-1">Inactive:</span>
            <span className="font-semibold text-destructive">{inactiveMRs}</span>
          </Badge>
        )}
      </div>

      <DataTable columns={columns} data={mrs} />

      <AddMRModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onMRAdded={handleMRAdded}
      />

      <DeactivateMRModal
        open={showDeactivateModal}
        onOpenChange={setShowDeactivateModal}
        mr={selectedMR}
        onConfirm={handleStatusChange}
        action={actionType}
      />
    </div>
  );
};
