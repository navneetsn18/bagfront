'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Luggage, 
  Search, 
  LogOut,
  Package,
  MapPin,
  Clock,
  Plane
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { Baggage } from '@/types';
import { toast } from 'sonner';

export default function UserDashboard() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [queryType, setQueryType] = useState<'baggage_id' | 'pnr'>('baggage_id');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Baggage[]>([]);

  useEffect(() => {
    if (!user || user.role !== 'user') {
      router.push('/login');
      return;
    }
  }, [user, router]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await apiClient.trackBaggage(query.trim(), queryType) as any;
      setResults(response.results);
      
      if (response.results.length === 0) {
        toast.error('No baggage found with the provided information');
      } else {
        toast.success(`Found ${response.results.length} baggage item(s)`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to track baggage');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
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

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Luggage className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">My Baggage</span>
            </div>
            <p className="text-gray-300">Welcome back, {user.name}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Track Your Baggage
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enter your Baggage ID or PNR to track your luggage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleTrack} className="space-y-4">
                <Tabs value={queryType} onValueChange={(value) => setQueryType(value as 'baggage_id' | 'pnr')}>
                  <TabsList className="grid w-full grid-cols-2 bg-white/10">
                    <TabsTrigger value="baggage_id" className="data-[state=active]:bg-cyan-500">Baggage ID</TabsTrigger>
                    <TabsTrigger value="pnr" className="data-[state=active]:bg-cyan-500">PNR</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="baggage_id" className="space-y-2">
                    <Label htmlFor="baggage-id" className="text-white">Baggage ID</Label>
                    <Input
                      id="baggage-id"
                      placeholder="Enter your baggage ID"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </TabsContent>
                  
                  <TabsContent value="pnr" className="space-y-2">
                    <Label htmlFor="pnr" className="text-white">PNR (Passenger Name Record)</Label>
                    <Input
                      id="pnr"
                      placeholder="Enter your PNR"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </TabsContent>
                </Tabs>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Tracking...' : 'Track Baggage'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {results.map((baggage) => (
              <Card key={baggage.id} className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center">
                      <Package className="h-5 w-5 mr-2" />
                      Your Baggage
                    </CardTitle>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(baggage.status)}`}>
                      {formatStatus(baggage.status)}
                    </div>
                  </div>
                  <CardDescription className="text-gray-300">
                    PNR: {baggage.pnr} | Baggage ID: {baggage.id}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Flight Info */}
                  <div className="flex items-center space-x-4 text-gray-300">
                    <Plane className="h-4 w-4" />
                    <span>{baggage.flightNumber}: {baggage.origin} → {baggage.destination}</span>
                  </div>

                  {/* Current Location */}
                  <div className="flex items-center space-x-4 text-gray-300">
                    <MapPin className="h-4 w-4" />
                    <span>Current Location: {baggage.currentLocation}</span>
                  </div>

                  {/* Last Updated */}
                  <div className="flex items-center space-x-4 text-gray-300">
                    <Clock className="h-4 w-4" />
                    <span>Last Updated: {new Date(baggage.updatedAt).toLocaleString()}</span>
                  </div>

                  {/* Progress Indicator */}
                  <div className="mt-6">
                    <h4 className="text-white font-semibold mb-3">Journey Progress</h4>
                    <div className="flex items-center justify-between text-sm">
                      <div className={`text-center ${baggage.status === 'checked_in' ? 'text-cyan-400' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${baggage.status === 'checked_in' ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
                        <span>Check-in</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 ${['security_cleared', 'loaded_on_aircraft', 'in_transit', 'arrived_at_destination', 'delivered'].includes(baggage.status) ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
                      <div className={`text-center ${baggage.status === 'security_cleared' ? 'text-cyan-400' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${['security_cleared', 'loaded_on_aircraft', 'in_transit', 'arrived_at_destination', 'delivered'].includes(baggage.status) ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
                        <span>Security</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 ${['loaded_on_aircraft', 'in_transit', 'arrived_at_destination', 'delivered'].includes(baggage.status) ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
                      <div className={`text-center ${baggage.status === 'loaded_on_aircraft' ? 'text-cyan-400' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${['loaded_on_aircraft', 'in_transit', 'arrived_at_destination', 'delivered'].includes(baggage.status) ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
                        <span>Loaded</span>
                      </div>
                      <div className={`flex-1 h-0.5 mx-2 ${['arrived_at_destination', 'delivered'].includes(baggage.status) ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
                      <div className={`text-center ${['arrived_at_destination', 'delivered'].includes(baggage.status) ? 'text-cyan-400' : 'text-gray-400'}`}>
                        <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${['arrived_at_destination', 'delivered'].includes(baggage.status) ? 'bg-cyan-400' : 'bg-gray-400'}`}></div>
                        <span>Arrived</span>
                      </div>
                    </div>
                  </div>

                  {/* Tracking History */}
                  {baggage.trackingHistory && baggage.trackingHistory.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-white font-semibold mb-3">Tracking History</h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {baggage.trackingHistory.map((event) => (
                          <div key={event.id} className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2"></div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-white font-medium">{formatStatus(event.status)}</span>
                                <span className="text-gray-400 text-sm">
                                  {new Date(event.timestamp).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-gray-300 text-sm">{event.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}