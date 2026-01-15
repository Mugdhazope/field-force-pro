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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Shop, ShopType } from '@/types';

interface AddShopModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShopAdded: (shop: Shop) => void;
  defaultType?: ShopType;
}

export const AddShopModal: React.FC<AddShopModalProps> = ({
  open,
  onOpenChange,
  onShopAdded,
  defaultType = 'chemist',
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: defaultType as ShopType,
    address: '',
    town: '',
    phone: '',
    contactPerson: '',
  });

  // Update form type when defaultType changes
  useEffect(() => {
    if (open) {
      setFormData(prev => ({ ...prev, type: defaultType }));
    }
  }, [open, defaultType]);

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Shop name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newShop: Shop = {
      id: `shop-${Date.now()}`,
      name: formData.name,
      type: formData.type,
      address: formData.address,
      town: formData.town || 'Unknown',
      phone: formData.phone,
      contactPerson: formData.contactPerson,
      coordinates: { lat: 19.0760, lng: 72.8777 },
      companyId: 'comp-001',
    };

    onShopAdded(newShop);
    
    toast({
      title: `${formData.type === 'stockist' ? 'Stockist' : 'Chemist'} Added`,
      description: `${formData.name} has been added.`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: defaultType,
      address: '',
      town: '',
      phone: '',
      contactPerson: '',
    });
  };

  const getTitle = () => {
    return formData.type === 'stockist' ? 'Add New Stockist' : 'Add New Chemist';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
          <DialogDescription>
            Add a {formData.type} to the database
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{formData.type === 'stockist' ? 'Stockist' : 'Chemist'} Name *</Label>
            <Input
              id="name"
              placeholder={formData.type === 'stockist' ? 'e.g., ABC Distributors' : 'e.g., MedPlus Pharmacy'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: ShopType) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chemist">Chemist</SelectItem>
                <SelectItem value="stockist">Stockist</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Full shop address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="town">Town / Area</Label>
              <Input
                id="town"
                placeholder="e.g., Andheri"
                value={formData.town}
                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+91 22 1234 5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPerson">Contact Person</Label>
            <Input
              id="contactPerson"
              placeholder="e.g., Mr. Suresh Patil"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              `Add ${formData.type === 'stockist' ? 'Stockist' : 'Chemist'}`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
