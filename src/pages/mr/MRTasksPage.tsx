import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClipboardList, Stethoscope, Store, Clock, CheckCircle } from 'lucide-react';
import { mockTasks } from '@/lib/mock-data';
import { Task, Visit } from '@/types';
import { format } from 'date-fns';
import { VisitModal } from '@/components/modals';

export const MRTasksPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pending');
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showVisitModal, setShowVisitModal] = useState(false);

  const userTasks = tasks.filter(t => t.mrId === user?.id);
  const pendingTasks = userTasks.filter(t => t.status === 'pending');
  const completedTasks = userTasks.filter(t => t.status === 'completed');

  const handleCompleteClick = (task: Task) => {
    setSelectedTask(task);
    setShowVisitModal(true);
  };

  const handleVisitRecorded = (visit: Visit) => {
    // Mark task as completed
    setTasks(prev => prev.map(t => 
      t.id === selectedTask?.id 
        ? { ...t, status: 'completed' as const, completedAt: visit.timestamp, visitId: visit.id }
        : t
    ));
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

      {/* Visit Modal for completing tasks */}
      <VisitModal
        open={showVisitModal}
        onOpenChange={setShowVisitModal}
        onVisitRecorded={handleVisitRecorded}
        visitType={selectedTask?.type === 'doctor' ? 'doctor' : 'chemist'}
        prefilledTask={selectedTask}
      />
    </div>
  );
};
