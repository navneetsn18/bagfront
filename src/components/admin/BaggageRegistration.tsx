'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Minus, QrCode, Download } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Flight } from '@/types';
import { toast } from 'sonner';

interface BaggageRegistrationProps {
  token: string;
  onSuccess: () => void;
}

interface BagItem {
  weight: string;
  description: string;
}

export default function BaggageRegistration({ token, onSuccess }: BaggageRegistrationProps) {
  const [pnr, setPnr] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [passengerEmail, setPassengerEmail] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [bags, setBags] = useState<BagItem[]>([{ weight: '', description: '' }]);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedBaggage, setGeneratedBaggage] = useState<any[]>([]);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      const response = await apiClient.getFlights() as any;
      setFlights(response);
    } catch (error) {
      toast.error('Failed to load flights');
    }
  };

  const addBag = () => {
    setBags([...bags, { weight: '', description: '' }]);
  };

  const removeBag = (index: number) => {
    if (bags.length > 1) {
      setBags(bags.filter((_, i) => i !== index));
    }
  };

  const updateBag = (index: number, field: keyof BagItem, value: string) => {
    const updatedBags = bags.map((bag, i) => 
      i === index ? { ...bag, [field]: value } : bag
    );
    setBags(updatedBags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pnr || !passengerName || !flightNumber) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const baggageData = {
        pnr: pnr.trim(),
        passengerName: passengerName.trim(),
        passengerEmail: passengerEmail?.trim() || null,
        flightNumber: flightNumber.trim(),
        bags: bags.map(bag => ({
          weight: parseFloat(bag.weight) || 0,
          description: bag.description.trim() || ''
        }))
      };

      console.log('🎒 Creating baggage with data:', baggageData);
      console.log('📦 Bags array details:', JSON.stringify(baggageData.bags, null, 2));
      
      // Test with direct fetch to see if the issue is with our API client
      console.log('🧪 Testing with direct fetch...');
      
      try {
        const testResponse = await fetch('http://localhost:8000/baggage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(baggageData)
        });
        
        console.log('🧪 Direct fetch response:', testResponse.status, testResponse.statusText);
        
        if (testResponse.ok) {
          const successData = await testResponse.json();
          console.log('🧪 Direct fetch SUCCESS:', successData);
          setGeneratedBaggage(successData.baggage);
          toast.success(successData.message);
          onSuccess();
          
          // Reset form
          setPnr('');
          setPassengerName('');
          setPassengerEmail('');
          setFlightNumber('');
          setBags([{ weight: '', description: '' }]);
          setIsLoading(false);
          return;
        } else {
          const errorData = await testResponse.json();
          console.log('🧪 Direct fetch FAILED:', errorData);
        }
      } catch (fetchError) {
        console.error('🧪 Direct fetch ERROR:', fetchError);
      }
      
      // If direct fetch fails, try with API client (this should not run if direct fetch works)
      console.log('🔄 Falling back to API client...');
      const response = await apiClient.createBaggage(baggageData, token) as any;

      setGeneratedBaggage(response.baggage);
      toast.success(response.message);
      onSuccess();
      
      // Reset form
      setPnr('');
      setPassengerName('');
      setPassengerEmail('');
      setFlightNumber('');
      setBags([{ weight: '', description: '' }]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to register baggage');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadQRCode = (baggage: any) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      
      const link = document.createElement('a');
      link.download = `baggage-${baggage.id}-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    
    img.src = `data:image/png;base64,${baggage.qrCode}`;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <QrCode className="h-5 w-5 mr-2" />
            Register Baggage
          </CardTitle>
          <CardDescription className="text-gray-300">
            Register new baggage and generate QR codes for tracking
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pnr" className="text-white">PNR *</Label>
                <Input
                  id="pnr"
                  value={pnr}
                  onChange={(e) => setPnr(e.target.value)}
                  placeholder="Enter PNR"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passenger-name" className="text-white">Passenger Name *</Label>
                <Input
                  id="passenger-name"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="Enter passenger name"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="passenger-email" className="text-white">Email (Optional)</Label>
                <Input
                  id="passenger-email"
                  type="email"
                  value={passengerEmail}
                  onChange={(e) => setPassengerEmail(e.target.value)}
                  placeholder="Enter email for notifications"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="flight" className="text-white">Flight *</Label>
                <select
                  id="flight"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full p-2 bg-white/10 border border-white/20 text-white rounded-md"
                  required
                >
                  <option value="">Select a flight</option>
                  {flights.map((flight) => (
                    <option key={flight.flightNumber} value={flight.flightNumber}>
                      {flight.flightNumber} - {flight.origin} to {flight.destination}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bags Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-white text-lg">Baggage Items</Label>
                <Button
                  type="button"
                  onClick={addBag}
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Bag
                </Button>
              </div>

              {bags.map((bag, index) => (
                <div key={index} className="flex items-end space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Label className="text-white">Weight (kg)</Label>
                    <Input
                      value={bag.weight}
                      onChange={(e) => updateBag(index, 'weight', e.target.value)}
                      placeholder="Enter weight"
                      type="number"
                      step="0.1"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div className="flex-2 space-y-2">
                    <Label className="text-white">Description</Label>
                    <Input
                      value={bag.description}
                      onChange={(e) => updateBag(index, 'description', e.target.value)}
                      placeholder="Enter description"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                  {bags.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeBag(index)}
                      size="sm"
                      variant="destructive"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register Baggage'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Generated QR Codes */}
      {generatedBaggage.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Generated QR Codes</CardTitle>
            <CardDescription className="text-gray-300">
              QR codes for the registered baggage items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedBaggage.map((baggage) => (
                <div key={baggage.id} className="bg-white/5 p-4 rounded-lg text-center">
                  <img
                    src={`data:image/png;base64,${baggage.qrCode}`}
                    alt={`QR Code for ${baggage.id}`}
                    className="w-32 h-32 mx-auto mb-2 bg-white p-2 rounded"
                  />
                  <p className="text-white text-sm font-semibold">
                    Baggage ID: {baggage.id}
                  </p>
                  <p className="text-gray-300 text-xs mb-2">
                    {baggage.description || 'No description'}
                  </p>
                  <Button
                    onClick={() => downloadQRCode(baggage)}
                    size="sm"
                    className="bg-cyan-500 hover:bg-cyan-600"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}