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
import { Loader2, MapPinned, Stethoscope, Store, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Visit, Doctor, Shop, Task } from '@/types';
import { mockDoctors, mockShops, mockProducts } from '@/lib/mock-data';
import { useAuth } from '@/contexts/AuthContext';

interface VisitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVisitRecorded: (visit: Visit) => void;
  visitType: 'doctor' | 'chemist' | 'stockist';
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
  const [gpsStatus, setGpsStatus] = useState<'loading' | 'captured' | 'error'>('loading');
  const [coordinates, setCoordinates] = useState({ lat: 0, lng: 0 });
  const [formData, setFormData] = useState({
    targetId: '',
    notes: '',
    selectedProducts: [] as string[],
  });

  const isDoctor = visitType === 'doctor';
  const targets = isDoctor ? mockDoctors : mockShops;

  useEffect(() => {
    if (open) {
      // Simulate GPS capture
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

      return () => clearTimeout(timer);
    }
  }, [open, prefilledTask, prefilledDoctorId, prefilledShopId]);

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
        description: `Please select a ${isDoctor ? 'doctor' : 'shop'}`,
        variant: 'destructive',
      });
      return;
    }

    if (gpsStatus !== 'captured') {
      toast({
        title: 'GPS Required',
        description: 'Please wait for GPS location to be captured',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const selectedTarget = targets.find(t => t.id === formData.targetId);

    const newVisit: Visit = {
      id: `visit-${Date.now()}`,
      type: isDoctor ? 'doctor' : 'shop',
      mrId: user?.id || 'user-002',
      mrName: user?.name || 'Unknown MR',
      ...(isDoctor
        ? { doctorId: formData.targetId, doctorName: (selectedTarget as Doctor)?.name }
        : { shopId: formData.targetId, shopName: (selectedTarget as Shop)?.name }
      ),
      timestamp: new Date().toISOString(),
      coordinates,
      notes: formData.notes,
      productsPromoted: formData.selectedProducts,
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
    setGpsStatus('loading');
  };

  const getTitle = () => {
    if (prefilledTask) return 'Complete Task';
    switch (visitType) {
      case 'doctor': return 'Record Doctor Visit';
      case 'chemist': return 'Record Chemist Visit';
      case 'stockist': return 'Record Stockist Visit';
    }
  };

  const getIcon = () => {
    return isDoctor ? <Stethoscope className="h-5 w-5" /> : <Store className="h-5 w-5" />;
  };

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
              : `Record your ${visitType} visit with GPS verification`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* GPS Status */}
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
              {gpsStatus === 'captured' && (
                <p className="text-xs text-muted-foreground">
                  Lat: {coordinates.lat.toFixed(4)}, Lng: {coordinates.lng.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          {/* Target Selection */}
          <div className="space-y-2">
            <Label>{isDoctor ? 'Select Doctor *' : 'Select Shop *'}</Label>
            <Select
              value={formData.targetId}
              onValueChange={(value) => setFormData({ ...formData, targetId: value })}
              disabled={!!prefilledTask}
            >
              <SelectTrigger>
                <SelectValue placeholder={`Select ${isDoctor ? 'doctor' : 'shop'}`} />
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
              {isDoctor ? 'Visit Notes' : visitType === 'stockist' ? 'Order / Availability Notes' : 'Stock Feedback / Notes'}
            </Label>
            <Textarea
              id="notes"
              placeholder={isDoctor 
                ? 'Notes about the visit, discussion points...'
                : 'Stock levels, orders, feedback...'
              }
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
            disabled={isSubmitting || gpsStatus !== 'captured'}
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
