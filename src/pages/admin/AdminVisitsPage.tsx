import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/PageHeader';
import { DataTable } from '@/components/shared/DataTable';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { VisitDetailModal } from '@/components/modals/VisitDetailModal';
import { MapPin, Stethoscope, Store, Building2, CalendarIcon, Filter, Eye, X } from 'lucide-react';
import { mockVisits, mockUsers } from '@/lib/mock-data';
import { Visit, VisitType } from '@/types';
import { format, isToday, isYesterday, startOfDay, endOfDay, isWithinInterval, subDays } from 'date-fns';
import { cn } from '@/lib/utils';

type DateFilter = 'all' | 'today' | 'yesterday' | 'week' | 'custom';

export const AdminVisitsPage: React.FC = () => {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [mrFilter, setMrFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>();
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>();
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);

  const mrList = mockUsers.filter(u => u.role === 'mr');

  const filterVisitsByDate = (visits: Visit[]): Visit[] => {
    return visits.filter(visit => {
      const visitDate = new Date(visit.timestamp);
      
      switch (dateFilter) {
        case 'today':
          return isToday(visitDate);
        case 'yesterday':
          return isYesterday(visitDate);
        case 'week':
          const weekAgo = subDays(new Date(), 7);
          return isWithinInterval(visitDate, { start: startOfDay(weekAgo), end: endOfDay(new Date()) });
        case 'custom':
          if (customDateFrom && customDateTo) {
            return isWithinInterval(visitDate, { 
              start: startOfDay(customDateFrom), 
              end: endOfDay(customDateTo) 
            });
          }
          return true;
        default:
          return true;
      }
    });
  };

  const filterVisitsByMR = (visits: Visit[]): Visit[] => {
    if (mrFilter === 'all') return visits;
    return visits.filter(visit => visit.mrId === mrFilter);
  };

  const filteredVisits = useMemo(() => {
    let visits = [...mockVisits];
    visits = filterVisitsByDate(visits);
    visits = filterVisitsByMR(visits);
    return visits;
  }, [dateFilter, mrFilter, customDateFrom, customDateTo]);

  const doctorVisits = filteredVisits.filter(v => v.type === 'doctor');
  const chemistVisits = filteredVisits.filter(v => v.type === 'chemist');
  const stockistVisits = filteredVisits.filter(v => v.type === 'stockist');

  const handleViewVisit = (visit: Visit) => {
    setSelectedVisit(visit);
    setShowDetailModal(true);
  };

  const clearFilters = () => {
    setMrFilter('all');
    setDateFilter('all');
    setCustomDateFrom(undefined);
    setCustomDateTo(undefined);
  };

  const hasActiveFilters = mrFilter !== 'all' || dateFilter !== 'all';

  const getDateFilterLabel = () => {
    switch (dateFilter) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'week': return 'Last 7 Days';
      case 'custom': 
        if (customDateFrom && customDateTo) {
          return `${format(customDateFrom, 'MMM d')} - ${format(customDateTo, 'MMM d')}`;
        }
        return 'Custom Range';
      default: return 'All Time';
    }
  };

  const columns = [
    { key: 'mrName', header: 'MR Name', priority: 1 },
    { 
      key: 'target', 
      header: 'Visited', 
      priority: 1, 
      render: (item: Visit) => item.doctorName || item.shopName 
    },
    { 
      key: 'timestamp', 
      header: 'Time', 
      priority: 2, 
      render: (item: Visit) => format(new Date(item.timestamp), 'MMM d, h:mm a') 
    },
    { 
      key: 'location', 
      header: 'Location', 
      priority: 3, 
      hideOnMobile: true,
      render: (item: Visit) => item.coordinates ? (
        <span className="text-xs text-muted-foreground">
          {item.coordinates.lat.toFixed(4)}, {item.coordinates.lng.toFixed(4)}
        </span>
      ) : '-'
    },
    { 
      key: 'status', 
      header: 'Status', 
      priority: 2, 
      render: () => <StatusBadge status="completed" /> 
    },
    { 
      key: 'actions', 
      header: '', 
      priority: 1, 
      render: (item: Visit) => (
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={(e) => {
            e.stopPropagation();
            handleViewVisit(item);
          }}
        >
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
      )
    },
  ];

  const getEmptyState = (type: VisitType) => (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          {type === 'doctor' ? <Stethoscope className="h-8 w-8 text-muted-foreground" /> : 
           type === 'chemist' ? <Store className="h-8 w-8 text-muted-foreground" /> : 
           <Building2 className="h-8 w-8 text-muted-foreground" />}
        </div>
        <h3 className="font-semibold mb-1">No {type} visits found</h3>
        <p className="text-sm text-muted-foreground">
          {hasActiveFilters 
            ? 'Try adjusting your filters to see more results.'
            : `${type.charAt(0).toUpperCase() + type.slice(1)} visits will appear here once recorded by MRs.`
          }
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader 
        title="Visit Records" 
        description="View and audit all doctor, chemist, and stockist visits" 
        icon={MapPin} 
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters:</span>
            </div>
            
            <div className="flex flex-wrap gap-2 flex-1">
              {/* MR Filter */}
              <Select value={mrFilter} onValueChange={setMrFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="All MRs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All MRs</SelectItem>
                  {mrList.map(mr => (
                    <SelectItem key={mr.id} value={mr.id}>{mr.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Date Filter */}
              <Select 
                value={dateFilter} 
                onValueChange={(value: DateFilter) => {
                  setDateFilter(value);
                  if (value === 'custom') {
                    setShowCustomDatePicker(true);
                  }
                }}
              >
                <SelectTrigger className="w-full sm:w-[160px]">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  <SelectValue>{getDateFilterLabel()}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>

              {/* Custom Date Range Picker */}
              {dateFilter === 'custom' && (
                <Popover open={showCustomDatePicker} onOpenChange={setShowCustomDatePicker}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <CalendarIcon className="h-4 w-4" />
                      {customDateFrom && customDateTo 
                        ? `${format(customDateFrom, 'MMM d')} - ${format(customDateTo, 'MMM d')}`
                        : 'Select dates'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <div className="p-3 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">From</p>
                          <Calendar
                            mode="single"
                            selected={customDateFrom}
                            onSelect={setCustomDateFrom}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">To</p>
                          <Calendar
                            mode="single"
                            selected={customDateTo}
                            onSelect={setCustomDateTo}
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => setShowCustomDatePicker(false)}
                      >
                        Apply
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filter Summary */}
          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t flex flex-wrap gap-2 text-sm">
              <span className="text-muted-foreground">Showing:</span>
              {mrFilter !== 'all' && (
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {mrList.find(m => m.id === mrFilter)?.name}
                </span>
              )}
              {dateFilter !== 'all' && (
                <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                  {getDateFilterLabel()}
                </span>
              )}
              <span className="text-muted-foreground ml-auto">
                {filteredVisits.length} visit{filteredVisits.length !== 1 ? 's' : ''} found
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visit Tabs */}
      <Tabs defaultValue="doctor" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="doctor" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Doctor</span>
            <span className="inline sm:hidden">Doc</span>
            <span className="hidden sm:inline text-xs text-muted-foreground">({doctorVisits.length})</span>
          </TabsTrigger>
          <TabsTrigger value="chemist" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Chemist</span>
            <span className="inline sm:hidden">Chem</span>
            <span className="hidden sm:inline text-xs text-muted-foreground">({chemistVisits.length})</span>
          </TabsTrigger>
          <TabsTrigger value="stockist" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Stockist</span>
            <span className="inline sm:hidden">Stock</span>
            <span className="hidden sm:inline text-xs text-muted-foreground">({stockistVisits.length})</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctor" className="mt-6">
          {doctorVisits.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={doctorVisits} 
              onRowClick={handleViewVisit}
            />
          ) : (
            getEmptyState('doctor')
          )}
        </TabsContent>

        <TabsContent value="chemist" className="mt-6">
          {chemistVisits.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={chemistVisits} 
              onRowClick={handleViewVisit}
            />
          ) : (
            getEmptyState('chemist')
          )}
        </TabsContent>

        <TabsContent value="stockist" className="mt-6">
          {stockistVisits.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={stockistVisits} 
              onRowClick={handleViewVisit}
            />
          ) : (
            getEmptyState('stockist')
          )}
        </TabsContent>
      </Tabs>

      {/* Visit Detail Modal */}
      <VisitDetailModal
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        visit={selectedVisit}
      />
    </div>
  );
};
