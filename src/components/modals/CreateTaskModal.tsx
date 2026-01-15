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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Task, Doctor, Shop, TaskType } from '@/types';
import { mockUsers, mockDoctors, mockShops } from '@/lib/mock-data';

interface CreateTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskCreated: (task: Task) => void;
}

export const CreateTaskModal: React.FC<CreateTaskModalProps> = ({
  open,
  onOpenChange,
  onTaskCreated,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    mrId: '',
    type: 'doctor' as TaskType,
    targetId: '',
    dueDate: '',
    dueTime: '',
    notes: '',
  });

  const mrs = mockUsers.filter(u => u.role === 'mr');
  const selectedMR = mrs.find(m => m.id === formData.mrId);
  
  // Get targets based on task type
  const getTargets = () => {
    switch (formData.type) {
      case 'doctor': return mockDoctors;
      case 'chemist': return mockShops.filter(s => !s.type || s.type === 'chemist');
      case 'stockist': return mockShops.filter(s => s.type === 'stockist');
      default: return [];
    }
  };
  
  const targets = getTargets();
  const selectedTarget = formData.type === 'doctor' 
    ? mockDoctors.find(t => t.id === formData.targetId)
    : mockShops.find(t => t.id === formData.targetId);

  const getTargetLabel = () => {
    switch (formData.type) {
      case 'doctor': return 'Doctor';
      case 'chemist': return 'Chemist';
      case 'stockist': return 'Stockist';
    }
  };

  const handleSubmit = async () => {
    if (!formData.mrId || !formData.targetId || !formData.dueDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const dueDateISO = `${formData.dueDate}T${formData.dueTime || '09:00'}:00Z`;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      mrId: formData.mrId,
      mrName: selectedMR?.name || '',
      type: formData.type,
      ...(formData.type === 'doctor' 
        ? { doctorId: formData.targetId, doctorName: (selectedTarget as Doctor)?.name }
        : { shopId: formData.targetId, shopName: (selectedTarget as Shop)?.name }
      ),
      dueDate: dueDateISO,
      notes: formData.notes,
      status: 'pending',
      createdBy: 'user-001',
      companyId: 'comp-001',
    };

    onTaskCreated(newTask);
    
    toast({
      title: 'Task Created',
      description: `Task assigned to ${selectedMR?.name}`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      mrId: '',
      type: 'doctor',
      targetId: '',
      dueDate: '',
      dueTime: '',
      notes: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Assign a task to a Medical Representative
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Assign To *</Label>
            <Select
              value={formData.mrId}
              onValueChange={(value) => setFormData({ ...formData, mrId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select MR" />
              </SelectTrigger>
              <SelectContent>
                {mrs.map((mr) => (
                  <SelectItem key={mr.id} value={mr.id}>
                    {mr.name} ({mr.headquarters})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Task Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: TaskType) => 
                setFormData({ ...formData, type: value, targetId: '' })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">Doctor Visit</SelectItem>
                <SelectItem value="chemist">Chemist Visit</SelectItem>
                <SelectItem value="stockist">Stockist Visit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Select {getTargetLabel()} *</Label>
            <Select
              value={formData.targetId}
              onValueChange={(value) => setFormData({ ...formData, targetId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${getTargetLabel().toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {targets.map((target) => (
                  <SelectItem key={target.id} value={target.id}>
                    {target.name} - {target.town}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueTime">Due Time</Label>
              <Input
                id="dueTime"
                type="time"
                value={formData.dueTime}
                onChange={(e) => setFormData({ ...formData, dueTime: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Task instructions or notes..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
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
              'Create Task'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};