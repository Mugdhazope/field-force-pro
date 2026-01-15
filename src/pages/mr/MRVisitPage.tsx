import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin, Stethoscope, Store, Building2, CheckCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { MapView } from '@/components/map/MapView';
import { VisitModal } from '@/components/modals/VisitModal';
import { VisitType, Visit } from '@/types';

export const MRVisitPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('type') as VisitType) || 'doctor';
  
  const [activeTab, setActiveTab] = useState<VisitType>(initialTab);
  const [showVisitModal, setShowVisitModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastVisitType, setLastVisitType] = useState<VisitType>('doctor');
  const { toast } = useToast();

  // Mock GPS coordinates (Mumbai area)
  const currentLocation = { lat: 19.0760, lng: 72.8777 };

  const handleVisitRecorded = (visit: Visit) => {
    setLastVisitType(visit.type);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const openVisitModal = (type: VisitType) => {
    setActiveTab(type);
    setShowVisitModal(true);
  };

  const getVisitTypeConfig = (type: VisitType) => {
    switch (type) {
      case 'doctor':
        return {
          icon: Stethoscope,
          title: 'Doctor Visit',
          description: 'Record a visit to a doctor with GPS verification and product promotion.',
          gpsRequired: true,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50 dark:bg-blue-950/30',
        };
      case 'chemist':
        return {
          icon: Store,
          title: 'Chemist Visit',
          description: 'Record a visit to a chemist. GPS location is optional.',
          gpsRequired: false,
          color: 'text-green-600',
          bgColor: 'bg-green-50 dark:bg-green-950/30',
        };
      case 'stockist':
        return {
          icon: Building2,
          title: 'Stockist Visit',
          description: 'Record a visit to a stockist with order and availability notes.',
          gpsRequired: false,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50 dark:bg-purple-950/30',
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Punch Visit"
        description="Record your visits to doctors, chemists, or stockists"
        icon={MapPin}
      />

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['doctor', 'chemist', 'stockist'] as VisitType[]).map((type) => {
          const config = getVisitTypeConfig(type);
          const Icon = config.icon;
          return (
            <Card 
              key={type}
              className={`cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary/30 ${config.bgColor}`}
              onClick={() => openVisitModal(type)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-background shadow-sm`}>
                    <Icon className={`h-6 w-6 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{config.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {config.description}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Record Visit
                      </Button>
                      {config.gpsRequired && (
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                          GPS Required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as VisitType)}>
        <TabsList className="grid w-full max-w-lg grid-cols-3">
          <TabsTrigger value="doctor" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            <span className="hidden sm:inline">Doctor</span>
          </TabsTrigger>
          <TabsTrigger value="chemist" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Chemist</span>
          </TabsTrigger>
          <TabsTrigger value="stockist" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Stockist</span>
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            {(['doctor', 'chemist', 'stockist'] as VisitType[]).map((type) => {
              const config = getVisitTypeConfig(type);
              const Icon = config.icon;
              return (
                <TabsContent key={type} value={type} className="mt-0 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className={`h-5 w-5 ${config.color}`} />
                        {config.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-muted-foreground">{config.description}</p>
                      
                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">GPS:</span>
                          <span className={config.gpsRequired ? 'text-destructive' : 'text-muted-foreground'}>
                            {config.gpsRequired ? 'Required' : 'Optional'}
                          </span>
                        </div>
                        {type === 'doctor' && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="font-medium">Products:</span>
                            <span className="text-muted-foreground">Can promote products</span>
                          </div>
                        )}
                      </div>

                      <Button 
                        size="lg" 
                        className="w-full mt-4"
                        onClick={() => setShowVisitModal(true)}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Record {config.title}
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              );
            })}
          </div>

          {/* GPS Location Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Current Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-sm font-medium text-success">Location Available</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Lat: {currentLocation.lat.toFixed(6)}<br />
                      Lng: {currentLocation.lng.toFixed(6)}
                    </p>
                  </div>
                  <MapView
                    points={[{
                      coordinates: currentLocation,
                      label: 'Your Location',
                      type: 'punch',
                    }]}
                    height="200px"
                    zoom={15}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visit Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <Stethoscope className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm">Doctor</p>
                    <p className="text-xs text-muted-foreground">GPS mandatory, products</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <Store className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm">Chemist</p>
                    <p className="text-xs text-muted-foreground">GPS optional, stock feedback</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="font-medium text-sm">Stockist</p>
                    <p className="text-xs text-muted-foreground">GPS optional, orders</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      {/* Visit Modal */}
      <VisitModal
        open={showVisitModal}
        onOpenChange={setShowVisitModal}
        visitType={activeTab}
        onVisitRecorded={handleVisitRecorded}
      />

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-6">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-center">Visit Recorded!</DialogTitle>
            <DialogDescription className="text-center mt-2">
              Your {lastVisitType} visit has been successfully recorded.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};