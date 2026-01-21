import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapView } from '@/components/map/MapView';
import { Visit } from '@/types';
import { format } from 'date-fns';
import { 
  User, 
  MapPin, 
  Clock, 
  FileText, 
  Package, 
  ClipboardList,
  Stethoscope,
  Store,
  Building2
} from 'lucide-react';

interface VisitDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit: Visit | null;
}

export const VisitDetailModal: React.FC<VisitDetailModalProps> = ({
  open,
  onOpenChange,
  visit,
}) => {
  if (!visit) return null;

  const getVisitIcon = () => {
    switch (visit.type) {
      case 'doctor': return <Stethoscope className="h-5 w-5" />;
      case 'chemist': return <Store className="h-5 w-5" />;
      case 'stockist': return <Building2 className="h-5 w-5" />;
    }
  };

  const getVisitTypeColor = () => {
    switch (visit.type) {
      case 'doctor': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200';
      case 'chemist': return 'bg-amber-500/10 text-amber-600 border-amber-200';
      case 'stockist': return 'bg-blue-500/10 text-blue-600 border-blue-200';
    }
  };

  const targetName = visit.doctorName || visit.shopName || 'Unknown';
  const mapPoints = visit.coordinates ? [{
    coordinates: visit.coordinates,
    label: targetName,
    timestamp: visit.timestamp,
    type: visit.type === 'doctor' ? 'doctor' as const : 'shop' as const,
  }] : [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getVisitTypeColor()}`}>
              {getVisitIcon()}
            </div>
            <div>
              <span className="capitalize">{visit.type} Visit</span>
              <p className="text-sm font-normal text-muted-foreground mt-0.5">
                Visit ID: {visit.id}
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Visit Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    {getVisitIcon()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      {visit.type === 'doctor' ? 'Doctor' : visit.type === 'chemist' ? 'Chemist' : 'Stockist'}
                    </p>
                    <p className="font-semibold truncate">{targetName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">MR Name</p>
                    <p className="font-semibold truncate">{visit.mrName}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Time & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Clock className="h-5 w-5 text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Punch-in Time</p>
                <p className="font-medium">{format(new Date(visit.timestamp), 'MMM d, yyyy • h:mm a')}</p>
              </div>
            </div>

            {visit.coordinates && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">GPS Coordinates</p>
                  <p className="font-medium text-sm">
                    {visit.coordinates.lat.toFixed(6)}, {visit.coordinates.lng.toFixed(6)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Map View */}
          {visit.coordinates && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location on Map
              </h4>
              <MapView 
                points={mapPoints} 
                height="200px" 
                zoom={15}
                center={visit.coordinates}
              />
            </div>
          )}

          <Separator />

          {/* Notes */}
          <div>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Notes
            </h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {visit.notes || 'No notes recorded for this visit.'}
            </p>
          </div>

          {/* Products Promoted (Doctor visits only) */}
          {visit.type === 'doctor' && visit.productsPromoted.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products Promoted
              </h4>
              <div className="flex flex-wrap gap-2">
                {visit.productsPromoted.map((productId, index) => (
                  <Badge key={index} variant="secondary">
                    {productId}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Associated Task */}
          {visit.taskId && (
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <ClipboardList className="h-4 w-4" />
                Associated Task
              </h4>
              <Badge variant="outline" className="font-mono">
                {visit.taskId}
              </Badge>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
