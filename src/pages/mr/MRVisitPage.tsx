import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin, Stethoscope, Store, MapPinned, CheckCircle, Loader2 } from 'lucide-react';
import { mockDoctors, mockShops, mockProducts } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { MapView } from '@/components/map/MapView';

export const MRVisitPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('type') === 'shop' ? 'shop' : 'doctor';
  
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedShop, setSelectedShop] = useState('');
  const [notes, setNotes] = useState('');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  // Mock GPS coordinates (Mumbai area)
  const currentLocation = { lat: 19.0760, lng: 72.8777 };

  const handleProductToggle = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleSubmit = async () => {
    if (activeTab === 'doctor' && !selectedDoctor) {
      toast({ title: 'Please select a doctor', variant: 'destructive' });
      return;
    }
    if (activeTab === 'shop' && !selectedShop) {
      toast({ title: 'Please select a shop', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setShowSuccess(true);

    // Reset form after success
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedDoctor('');
      setSelectedShop('');
      setNotes('');
      setSelectedProducts([]);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Punch Visit"
        description="Record your doctor or shop visit with GPS verification"
        icon={MapPin}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="doctor" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Doctor Visit
          </TabsTrigger>
          <TabsTrigger value="shop" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            Shop Visit
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <TabsContent value="doctor" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Doctor Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Doctor</Label>
                    <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Search and select a doctor..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockDoctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            <div className="flex flex-col">
                              <span>{doctor.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {doctor.specialization} • {doctor.town}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Visit Notes</Label>
                    <Textarea
                      placeholder="Enter notes about this visit..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Products Promoted</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {mockProducts.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => handleProductToggle(product.id)}
                      >
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onCheckedChange={() => handleProductToggle(product.id)}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="shop" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Shop Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Select Shop</Label>
                    <Select value={selectedShop} onValueChange={setSelectedShop}>
                      <SelectTrigger>
                        <SelectValue placeholder="Search and select a shop..." />
                      </SelectTrigger>
                      <SelectContent>
                        {mockShops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.id}>
                            <div className="flex flex-col">
                              <span>{shop.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {shop.address}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Visit Notes</Label>
                    <Textarea
                      placeholder="Enter notes about this visit..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <Button
              size="lg"
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording Visit...
                </>
              ) : (
                <>
                  <MapPinned className="mr-2 h-4 w-4" />
                  Punch Visit
                </>
              )}
            </Button>
          </div>

          {/* GPS Location Card */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPinned className="h-5 w-5 text-primary" />
                  GPS Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-success/10 rounded-lg border border-success/20">
                    <p className="text-sm font-medium text-success">Location Captured</p>
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
                <CardTitle>Visit Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span className="font-medium capitalize">{activeTab} Visit</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span className="font-medium">{new Date().toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Products</span>
                  <span className="font-medium">{selectedProducts.length} selected</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center py-6">
            <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <DialogTitle className="text-center">Visit Recorded!</DialogTitle>
            <DialogDescription className="text-center mt-2">
              Your {activeTab} visit has been successfully recorded with GPS verification.
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
