import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, MapPinned, Stethoscope, Store, Package, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Visit, Doctor, Shop, Task, VisitType } from '@/types';
import { mockDoctors, mockShops, mockProducts } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';

interface VisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVisitRecorded: (visit: Visit) => void;
  visitType: VisitType;
  prefilledTask?: Task | null;
  prefilledDoctorId?: string;
  prefilledShopId?: string;
}

export const VisitModal: React.FC<VisitModalProps> = ({
  open,
  onOpenChange,
  onVisitRecorded,
  visitType,
  prefilledTask,
  prefilledDoctorId,
  prefilledShopId,
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'loading' | 'captured' | 'error' | 'not-required'>('loading');
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [formData, setFormData] = useState({
    targetId: '',
    notes: '',
    selectedProducts: [] as string[],
  });

  const isDoctor = visitType === 'doctor';
  const isChemist = visitType === 'chemist';
  const isStockist = visitType === 'stockist';
  
  // GPS is mandatory only for doctor visits
  const gpsRequired = isDoctor;
  
  // Filter shops by type for chemist/stockist
  const getTargets = () => {
    if (isDoctor) return mockDoctors;
    if (isChemist) return mockShops.filter(s => !s.type || s.type === 'chemist');
    if (isStockist) return mockShops.filter(s => s.type === 'stockist');
    return mockShops;
  };
  
  const targets = getTargets();

  useEffect(() => {
    if (open) {
      if (gpsRequired) {
        // Capture GPS for doctor visits
        setGpsStatus('loading');
        const timer = setTimeout(() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                setCoordinates({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
                setGpsStatus('captured');
              },
              () => {
                // Fallback coordinates for demo
                setCoordinates({ lat: 19.0760, lng: 72.8777 });
                setGpsStatus('captured');
              }
            );
          } else {
            setCoordinates({ lat: 19.0760, lng: 72.8777 });
            setGpsStatus('captured');
          }
        }, 1000);
        return () => clearTimeout(timer);
      } else {
        // GPS not required for chemist/stockist
        setGpsStatus('not-required');
        setCoordinates(null);
      }

      // Pre-fill from task or props
      if (prefilledTask) {
        setFormData({
          targetId: prefilledTask.doctorId || prefilledTask.shopId || '',
          notes: '',
          selectedProducts: [],
        });
      } else if (prefilledDoctorId) {
        setFormData(prev => ({ ...prev, targetId: prefilledDoctorId }));
      } else if (prefilledShopId) {
        setFormData(prev => ({ ...prev, targetId: prefilledShopId }));
      }
    }
  }, [open, prefilledTask, prefilledDoctorId, prefilledShopId, gpsRequired]);

  const handleProductToggle = (productId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.includes(productId)
        ? prev.selectedProducts.filter(id => id !== productId)
        : [...prev.selectedProducts, productId],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.targetId) {
      toast({
        title: 'Validation Error',
        description: `Please select a ${getTargetLabel().toLowerCase()}`,
        variant: 'destructive',
      });
      return;
    }

    if (gpsRequired && gpsStatus !== 'captured') {
      toast({
        title: 'GPS Required',
        description: 'Please wait for GPS location to be captured',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedTarget = isDoctor 
      ? mockDoctors.find(t => t.id === formData.targetId)
      : mockShops.find(t => t.id === formData.targetId);

    const newVisit: Visit = {
      id: `visit-${Date.now()}`,
      type: visitType,
      mrId: user?.id || 'user-002',
      mrName: user?.name || 'Unknown MR',
      ...(isDoctor
        ? { doctorId: formData.targetId, doctorName: (selectedTarget as Doctor)?.name }
        : { shopId: formData.targetId, shopName: (selectedTarget as Shop)?.name }
      ),
      timestamp: new Date().toISOString(),
      coordinates: coordinates || undefined,
      notes: formData.notes,
      productsPromoted: isDoctor ? formData.selectedProducts : [],
      taskId: prefilledTask?.id,
      companyId: 'comp-001',
    };

    onVisitRecorded(newVisit);
    
    toast({
      title: 'Visit Recorded!',
      description: `Visit to ${selectedTarget?.name} has been logged successfully.`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      targetId: '',
      notes: '',
      selectedProducts: [],
    });
    setGpsStatus(gpsRequired ? 'loading' : 'not-required');
  };

  const getTitle = () => {
    if (prefilledTask) return 'Complete Task';
    switch (visitType) {
      case 'doctor': return 'Record Doctor Visit';
      case 'chemist': return 'Record Chemist Visit';
      case 'stockist': return 'Record Stockist Visit';
    }
  };

  const getTargetLabel = () => {
    switch (visitType) {
      case 'doctor': return 'Doctor';
      case 'chemist': return 'Chemist';
      case 'stockist': return 'Stockist';
    }
  };

  const getIcon = () => {
    switch (visitType) {
      case 'doctor': return <Stethoscope className="h-5 w-5" />;
      case 'chemist': return <Store className="h-5 w-5" />;
      case 'stockist': return <Building2 className="h-5 w-5" />;
    }
  };

  const getNotesPlaceholder = () => {
    switch (visitType) {
      case 'doctor': return 'Notes about the visit, discussion points...';
      case 'chemist': return 'Stock levels, feedback, notes...';
      case 'stockist': return 'Order details, availability notes...';
    }
  };

  const canSubmit = gpsRequired ? gpsStatus === 'captured' : true;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
          <DialogDescription>
            {prefilledTask
              ? `Complete your visit to ${prefilledTask.doctorName || prefilledTask.shopName}`
              : `Record your ${visitType} visit${gpsRequired ? ' with GPS verification' : ''}`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* GPS Status - Only show for doctor visits */}
          {gpsRequired && (
            <div className={`p-3 rounded-lg border flex items-center gap-3 ${
              gpsStatus === 'captured' 
                ? 'bg-success/10 border-success/20' 
                : gpsStatus === 'error'
                ? 'bg-destructive/10 border-destructive/20'
                : 'bg-muted border-border'
            }`}>
              {gpsStatus === 'loading' ? (
                <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
              ) : (
                <MapPinned className={`h-5 w-5 ${gpsStatus === 'captured' ? 'text-success' : 'text-destructive'}`} />
              )}
              <div>
                <p className={`text-sm font-medium ${
                  gpsStatus === 'captured' ? 'text-success' : 
                  gpsStatus === 'error' ? 'text-destructive' : 'text-muted-foreground'
                }`}>
                  {gpsStatus === 'loading' && 'Capturing GPS Location...'}
                  {gpsStatus === 'captured' && 'GPS Location Captured'}
                  {gpsStatus === 'error' && 'GPS Error - Using fallback'}
                </p>
                {gpsStatus === 'captured' && coordinates && (
                  <p className="text-xs text-muted-foreground">
                    Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* GPS Not Required Notice */}
          {!gpsRequired && (
            <div className="p-3 rounded-lg border bg-muted/50 border-border flex items-center gap-3">
              <MapPinned className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                GPS location is optional for {visitType} visits
              </p>
            </div>
          )}

          {/* Target Selection */}
          <div className="space-y-2">
            <Label>Select {getTargetLabel()} *</Label>
            <Select
              value={formData.targetId}
              onValueChange={(value) => setFormData({ ...formData, targetId: value })}
              disabled={!!prefilledTask}
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

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">
              {visitType === 'stockist' ? 'Order / Availability Notes' : 'Notes'}
            </Label>
            <Textarea
              id="notes"
              placeholder={getNotesPlaceholder()}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
            />
          </div>

          {/* Products - Only for Doctor visits */}
          {isDoctor && (
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products Promoted
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-1 border rounded-lg">
                {mockProducts.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center space-x-2 p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleProductToggle(product.id)}
                  >
                    <Checkbox 
                      checked={formData.selectedProducts.includes(product.id)}
                      onCheckedChange={() => handleProductToggle(product.id)}
                    />
                    <span className="text-sm truncate">{product.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting || !canSubmit}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Recording...
              </>
            ) : (
              prefilledTask ? 'Complete Task' : 'Record Visit'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};