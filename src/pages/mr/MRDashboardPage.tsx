import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapView } from '@/components/map/MapView';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  ClipboardList,
  CheckCircle,
  Clock,
  MapPin,
  ArrowRight,
  Stethoscope,
  Store,
} from 'lucide-react';
import { mockMRDashboardMetrics, mockTasks, mockVisits, mockAttendance } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export const MRDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const metrics = mockMRDashboardMetrics;
  
  // Get today's data for current user
  const todaysTasks = mockTasks.filter(t => t.mrId === user?.id && t.status === 'pending');
  const todaysVisits = mockVisits.filter(v => v.mrId === user?.id);
  const todaysAttendance = mockAttendance.find(a => a.mrId === user?.id);

  const routePoints = todaysAttendance?.route.map(r => ({
    coordinates: r.coordinates,
    label: r.label,
    timestamp: r.timestamp,
    type: r.type as 'punch' | 'visit',
  })) || [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={`Good ${getGreeting()}, ${user?.name?.split(' ')[0]}!`}
        description={format(new Date(), 'EEEE, MMMM d, yyyy')}
        icon={LayoutDashboard}
      />

      {/* Today's Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Assigned Tasks"
          value={metrics.assignedTasks}
          subtitle="For today"
          icon={ClipboardList}
          iconClassName="bg-primary/10 text-primary"
        />
        <MetricCard
          title="Completed Visits"
          value={metrics.completedVisits}
          subtitle="Today"
          icon={CheckCircle}
          iconClassName="bg-success/10 text-success"
        />
        <MetricCard
          title="Pending Approvals"
          value={metrics.pendingApprovals}
          subtitle="Awaiting review"
          icon={Clock}
          iconClassName="bg-warning/10 text-warning"
        />
        <MetricCard
          title="Route Points"
          value={routePoints.length}
          subtitle="Tracked today"
          icon={MapPin}
          iconClassName="bg-info/10 text-info"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Upcoming Tasks</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/mr/tasks">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todaysTasks.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending tasks for today</p>
            ) : (
              <div className="space-y-3">
                {todaysTasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        task.type === 'doctor' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                        {task.type === 'doctor' ? <Stethoscope className="h-5 w-5" /> : <Store className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{task.doctorName || task.shopName}</p>
                        <p className="text-sm text-muted-foreground">
                          Due: {format(new Date(task.dueDate), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Visits */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Visits</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/mr/attendance">
                View All <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {todaysVisits.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No visits recorded today</p>
            ) : (
              <div className="space-y-3">
                {todaysVisits.slice(0, 4).map((visit) => (
                  <div
                    key={visit.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        visit.type === 'doctor' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>
                        {visit.type === 'doctor' ? <Stethoscope className="h-5 w-5" /> : <Store className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-medium">{visit.doctorName || visit.shopName}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(visit.timestamp), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      Completed
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Today's Route Map */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Today's Route</CardTitle>
        </CardHeader>
        <CardContent>
          {routePoints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <MapPin className="h-12 w-12 mb-4 opacity-50" />
              <p>No route tracked yet today</p>
              <Button className="mt-4" asChild>
                <Link to="/mr/visit">Start Tracking</Link>
              </Button>
            </div>
          ) : (
            <MapView points={routePoints} showRoute height="350px" />
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Button asChild size="lg" className="h-auto py-6 flex-col gap-2">
          <Link to="/mr/visit">
            <Stethoscope className="h-6 w-6" />
            <span>Punch Doctor Visit</span>
          </Link>
        </Button>
        <Button asChild variant="secondary" size="lg" className="h-auto py-6 flex-col gap-2">
          <Link to="/mr/visit?type=shop">
            <Store className="h-6 w-6" />
            <span>Punch Shop Visit</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-auto py-6 flex-col gap-2">
          <Link to="/mr/tasks">
            <ClipboardList className="h-6 w-6" />
            <span>View Tasks</span>
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="h-auto py-6 flex-col gap-2">
          <Link to="/mr/doctors">
            <MapPin className="h-6 w-6" />
            <span>Nearby Doctors</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}
