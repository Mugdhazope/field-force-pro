import React from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, Download } from 'lucide-react';

const reports = [
  { title: 'Visit Report', description: 'Detailed visit logs by MR and doctor' },
  { title: 'Attendance Report', description: 'Daily attendance and punch times' },
  { title: 'Expense Report', description: 'Monthly expense summary by MR' },
  { title: 'Product Promotion Report', description: 'Product promotion frequency analysis' },
  { title: 'Doctor Coverage Report', description: 'Doctor visit coverage statistics' },
  { title: 'Incentive Summary', description: 'MR incentive calculation report' },
];

export const AdminReportsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Reports" description="Generate and export reports" icon={BarChart3} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((report) => (
          <Card key={report.title} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                {report.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
              <Button variant="outline" className="w-full"><Download className="h-4 w-4 mr-2" />Export</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
