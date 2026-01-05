import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ClipboardList, Stethoscope, Store, MapPinned, Clock, Loader2, CheckCircle } from 'lucide-react';
import { mockTasks, mockProducts } from '@/lib/mock-data';
import { Task } from '@/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export const MRTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [notes, setNotes] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userTasks = mockTasks.filter(t => t.mrId === user?.id);
  const pendingTasks = userTasks.filter(t => t.status === 'pending');
  const completedTasks = userTasks.filter(t => t.status === 'completed');

  const handleCompleteClick = (task: Task) => {
    setSelectedTask(task);
    setShowCompleteDialog(true);
    setNotes('');
    setSelectedProducts([]);
  };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmitCompletion = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: 'Task Completed!',
      description: `Visit to ${selectedTask?.doctorName || selectedTask?.shopName} has been recorded.`,
    });
    
    setIsSubmitting(false);
    setShowCompleteDialog(false);
    setSelectedTask(null);
  };

  const TaskCard: React.FC<{ task: Task; showComplete?: boolean }> = ({ task, showComplete }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
              task.type === 'doctor' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
            }`}>
              {task.type === 'doctor' ? <Stethoscope className="h-5 w-5" /> : <Store className="h-5 w-5" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{task.doctorName || task.shopName}</p>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Due: {format(new Date(task.dueDate), 'MMM d, h:mm a')}</span>
              </div>
              {task.notes && (
                <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{task.notes}</p>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={task.status} />
            {showComplete && task.status === 'pending' && (
              <Button size="sm" onClick={() => handleCompleteClick(task)}>
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My Tasks"
        description="View and complete your assigned tasks"
        icon={ClipboardList}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            Pending
            {pendingTasks.length > 0 && (
              <span className="ml-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {pendingTasks.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-success mb-4" />
                <p className="text-lg font-medium">All caught up!</p>
                <p className="text-muted-foreground">No pending tasks for today.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingTasks.map((task) => (
                <TaskCard key={task.id} task={task} showComplete />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedTasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ClipboardList className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No completed tasks yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Complete Task Dialog */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
            <DialogDescription>
              Record your visit to {selectedTask?.doctorName || selectedTask?.shopName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-3 bg-success/10 rounded-lg border border-success/20 flex items-center gap-3">
              <MapPinned className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm font-medium text-success">GPS Location Captured</p>
                <p className="text-xs text-muted-foreground">Lat: 19.0760, Lng: 72.8777</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Visit Notes</Label>
              <Textarea
                placeholder="Enter notes about this visit..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>

            {selectedTask?.type === 'doctor' && (
              <div className="space-y-2">
                <Label>Products Promoted</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1">
                  {mockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center space-x-2 p-2 rounded border hover:bg-muted/50 cursor-pointer"
                      onClick={() => handleProductToggle(product.id)}
                    >
                      <Checkbox checked={selectedProducts.includes(product.id)} />
                      <span className="text-sm truncate">{product.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitCompletion} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                'Complete Task'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
