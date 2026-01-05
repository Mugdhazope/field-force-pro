import React from 'react';
import { MetricCard } from '@/components/shared/MetricCard';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, MapPin, CheckCircle, Clock, Stethoscope, Store, ArrowRight } from 'lucide-react';
import { mockAdminDashboardMetrics, mockVisitChartData, mockMRComparisonData } from '@/lib/mock-data';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const metrics = mockAdminDashboardMetrics;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard"
        description="Overview of field force activities"
        icon={LayoutDashboard}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Visits Today" value={metrics.totalVisitsToday} icon={MapPin} iconClassName="bg-primary/10 text-primary" />
        <MetricCard title="Attendance Rate" value={`${metrics.attendancePercentage}%`} subtitle={`${metrics.activeMRs}/${metrics.totalMRs} MRs active`} icon={Users} iconClassName="bg-success/10 text-success" />
        <MetricCard title="Doctors Covered" value={metrics.doctorsCovered} icon={Stethoscope} iconClassName="bg-info/10 text-info" />
        <MetricCard title="Pending Approvals" value={metrics.pendingApprovals} icon={Clock} iconClassName="bg-warning/10 text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Daily Visits (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockVisitChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="label" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>MR Performance</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/mr-tracking">View All <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockMRComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" />
                <YAxis dataKey="name" type="category" className="text-xs" width={100} />
                <Tooltip />
                <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
