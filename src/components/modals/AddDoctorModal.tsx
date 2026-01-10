import React, { useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Doctor } from '@/types';

interface AddDoctorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDoctorAdded: (doctor: Doctor) => void;
}

export const AddDoctorModal: React.FC<AddDoctorModalProps> = ({
  open,
  onOpenChange,
  onDoctorAdded,
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    qualification: '',
    town: '',
    headquarters: '',
    address: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Doctor name is required',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newDoctor: Doctor = {
      id: `doc-${Date.now()}`,
      name: formData.name,
      specialization: formData.specialization || 'General Physician',
      qualification: formData.qualification || 'MBBS',
      town: formData.town || 'Unknown',
      headquarters: formData.headquarters || formData.town || 'HQ',
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      visitFrequency: { thisWeek: 0, thisMonth: 0 },
      coordinates: { lat: 19.0760, lng: 72.8777 },
      companyId: 'comp-001',
    };

    onDoctorAdded(newDoctor);
    
    toast({
      title: 'Doctor Added',
      description: `${formData.name} has been added to the database.`,
    });

    setIsSubmitting(false);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      specialization: '',
      qualification: '',
      town: '',
      headquarters: '',
      address: '',
      phone: '',
      email: '',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
          <DialogDescription>
            Add a doctor to the database for visits
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Doctor Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Dr. Anil Mehta"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                placeholder="e.g., Cardiologist"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="qualification">Qualification</Label>
              <Input
                id="qualification"
                placeholder="e.g., MBBS, MD"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="town">Town / Area</Label>
              <Input
                id="town"
                placeholder="e.g., Andheri West"
                value={formData.town}
                onChange={(e) => setFormData({ ...formData, town: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headquarters">Headquarters</Label>
              <Input
                id="headquarters"
                placeholder="e.g., Mumbai Central"
                value={formData.headquarters}
                onChange={(e) => setFormData({ ...formData, headquarters: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Clinic Address</Label>
            <Input
              id="address"
              placeholder="Full clinic address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="doctor@clinic.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
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
              'Add Doctor'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
