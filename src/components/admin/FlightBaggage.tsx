'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plane, Package, MapPin, Clock } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Flight, Baggage } from '@/types';
import { toast } from 'sonner';

interface FlightBaggageProps {
  token: string;
}

export default function FlightBaggage({ token }: FlightBaggageProps) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState('');
  const [flightBaggage, setFlightBaggage] = useState<Baggage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleFlightSelect = async (flightNumber: string) => {
    if (!flightNumber) {
      setFlightBaggage([]);
      return;
    }

    setSelectedFlight(flightNumber);
    setIsLoading(true);
    
    try {
      const response = await apiClient.getFlightBaggage(flightNumber, token) as any;
      setFlightBaggage(response.baggage);
      toast.success(`Found ${response.count} baggage items for flight ${flightNumber}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to load flight baggage');
      setFlightBaggage([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'checked_in': 'text-blue-400',
      'security_cleared': 'text-yellow-400',
      'loaded_on_aircraft': 'text-purple-400',
      'in_transit': 'text-orange-400',
      'arrived_at_destination': 'text-green-400',
      'delivered': 'text-emerald-400',
      'lost': 'text-red-400'
    };
    return colors[status as keyof typeof colors] || 'text-gray-400';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getStatusStats = () => {
    const stats: Record<string, number> = {};
    flightBaggage.forEach(baggage => {
      stats[baggage.status] = (stats[baggage.status] || 0) + 1;
    });
    return stats;
  };

  const statusStats = getStatusStats();

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Plane className="h-5 w-5 mr-2" />
            Flight Baggage Management
          </CardTitle>
          <CardDescription className="text-gray-300">
            View and manage all baggage for specific flights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Select Flight</Label>
              <select
                value={selectedFlight}
                onChange={(e) => handleFlightSelect(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 text-white rounded-md"
              >
                <option value="">Choose a flight</option>
                {flights.map((flight) => (
                  <option key={flight.flightNumber} value={flight.flightNumber}>
                    {flight.flightNumber} - {flight.origin} to {flight.destination}
                  </option>
                ))}
              </select>
            </div>

            {selectedFlight && (
              <div className="p-4 bg-white/5 rounded-lg">
                <h3 className="text-white font-semibold mb-2">Flight Information</h3>
                {flights.find(f => f.flightNumber === selectedFlight) && (
                  <div className="text-gray-300 text-sm space-y-1">
                    <p>Flight: {selectedFlight}</p>
                    <p>Route: {flights.find(f => f.flightNumber === selectedFlight)?.origin} → {flights.find(f => f.flightNumber === selectedFlight)?.destination}</p>
                    <p>Departure: {new Date(flights.find(f => f.flightNumber === selectedFlight)?.departureTime || '').toLocaleString()}</p>
                    <p>Total Baggage: {flightBaggage.length}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Status Summary */}
      {flightBaggage.length > 0 && (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Baggage Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(statusStats).map(([status, count]) => (
                <div key={status} className="bg-white/5 p-4 rounded-lg text-center">
                  <p className={`text-2xl font-bold ${getStatusColor(status)}`}>{count}</p>
                  <p className="text-gray-300 text-sm">{formatStatus(status)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Baggage List */}
      {isLoading ? (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <p className="text-white">Loading baggage information...</p>
          </CardContent>
        </Card>
      ) : flightBaggage.length > 0 ? (
        <div className="space-y-4">
          {flightBaggage.map((baggage) => (
            <Card key={baggage.id} className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Baggage ID: {baggage.id}
                  </CardTitle>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(baggage.status)}`}>
                    {formatStatus(baggage.status)}
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  PNR: {baggage.pnr} | Passenger: {baggage.passengerName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location: {baggage.currentLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Updated: {new Date(baggage.updatedAt).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4" />
                    <span>Weight: {baggage.weight || 'N/A'} kg</span>
                  </div>
                </div>
                
                {baggage.description && (
                  <div className="mt-2 text-gray-300 text-sm">
                    Description: {baggage.description}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : selectedFlight ? (
        <Card className="bg-white/10 backdrop-blur-lg border-white/20">
          <CardContent className="p-8 text-center">
            <p className="text-gray-300">No baggage found for flight {selectedFlight}</p>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}