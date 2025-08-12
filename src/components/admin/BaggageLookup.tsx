'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Package, MapPin, Clock, Edit } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Baggage } from '@/types';
import { toast } from 'sonner';

interface BaggageLookupProps {
  token: string;
  onSuccess: () => void;
}

export default function BaggageLookup({ token, onSuccess }: BaggageLookupProps) {
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState<'baggage_id' | 'pnr'>('baggage_id');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Baggage[]>([]);
  const [editingBaggage, setEditingBaggage] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newLocation, setNewLocation] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiClient.trackBaggage(query.trim(), queryType) as any;
      setResults(response.results);
      
      if (response.results.length === 0) {
        toast.error('No baggage found');
      } else {
        toast.success(`Found ${response.results.length} baggage item(s)`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Search failed');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (baggageId: string) => {
    if (!newStatus) {
      toast.error('Please select a status');
      return;
    }

    try {
      await apiClient.updateBaggage(baggageId, {
        status: newStatus,
        location: newLocation || undefined
      }, token);
      
      toast.success('Baggage updated successfully');
      setEditingBaggage(null);
      setNewStatus('');
      setNewLocation('');
      onSuccess();
      
      // Refresh the search results
      handleSearch(new Event('submit') as any);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Update failed');
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

  const statusOptions = [
    'checked_in',
    'security_cleared',
    'loaded_on_aircraft',
    'in_transit',
    'arrived_at_destination',
    'delivered',
    'lost'
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Baggage Lookup
          </CardTitle>
          <CardDescription className="text-gray-300">
            Search and manage baggage by ID or PNR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <Tabs value={queryType} onValueChange={(value) => setQueryType(value as 'baggage_id' | 'pnr')}>
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="baggage_id" className="data-[state=active]:bg-cyan-500">Baggage ID</TabsTrigger>
                <TabsTrigger value="pnr" className="data-[state=active]:bg-cyan-500">PNR</TabsTrigger>
              </TabsList>
              
              <TabsContent value="baggage_id" className="space-y-2">
                <Label htmlFor="baggage-id" className="text-white">Baggage ID</Label>
                <Input
                  id="baggage-id"
                  placeholder="Enter baggage ID"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </TabsContent>
              
              <TabsContent value="pnr" className="space-y-2">
                <Label htmlFor="pnr" className="text-white">PNR</Label>
                <Input
                  id="pnr"
                  placeholder="Enter PNR"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </TabsContent>
            </Tabs>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
              disabled={isLoading}
            >
              {isLoading ? 'Searching...' : 'Search Baggage'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          {results.map((baggage) => (
            <Card key={baggage.id} className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Baggage ID: {baggage.id}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(baggage.status)}`}>
                      {formatStatus(baggage.status)}
                    </div>
                    <Button
                      onClick={() => setEditingBaggage(editingBaggage === baggage.id ? null : baggage.id)}
                      size="sm"
                      variant="outline"
                      className="border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-gray-300">
                  PNR: {baggage.pnr} | Passenger: {baggage.passengerName}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Baggage Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Location: {baggage.currentLocation}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4" />
                    <span>Updated: {new Date(baggage.updatedAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Edit Form */}
                {editingBaggage === baggage.id && (
                  <div className="border-t border-white/20 pt-4 space-y-4">
                    <h4 className="text-white font-semibold">Update Baggage Status</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-white">New Status</Label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="w-full p-2 bg-white/10 border border-white/20 text-white rounded-md"
                        >
                          <option value="">Select status</option>
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {formatStatus(status)}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-white">New Location (Optional)</Label>
                        <Input
                          value={newLocation}
                          onChange={(e) => setNewLocation(e.target.value)}
                          placeholder="Enter new location"
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleUpdateStatus(baggage.id)}
                        className="bg-green-500 hover:bg-green-600"
                        disabled={!newStatus}
                      >
                        Update Status
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingBaggage(null);
                          setNewStatus('');
                          setNewLocation('');
                        }}
                        variant="outline"
                        className="border-gray-400 text-gray-400 hover:bg-gray-400 hover:text-white"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Tracking History */}
                {baggage.trackingHistory && baggage.trackingHistory.length > 0 && (
                  <div className="border-t border-white/20 pt-4">
                    <h4 className="text-white font-semibold mb-3">Tracking History</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {baggage.trackingHistory.map((event) => (
                        <div key={event.id} className="flex items-start space-x-3 p-2 bg-white/5 rounded">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-white text-sm font-medium">
                                {formatStatus(event.status)}
                              </span>
                              <span className="text-gray-400 text-xs">
                                {new Date(event.timestamp).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-gray-300 text-xs">{event.location}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}