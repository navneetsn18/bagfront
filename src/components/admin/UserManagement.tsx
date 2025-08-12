'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, Plus, Mail, User, Plane } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { Flight } from '@/types';
import { toast } from 'sonner';

interface UserManagementProps {
  token: string;
  onSuccess: () => void;
}

export default function UserManagement({ token, onSuccess }: UserManagementProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [pnr, setPnr] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    try {
      console.log('✈️ Loading flights...');
      const response = await apiClient.getFlights() as any;
      setFlights(response);
      console.log('✅ Flights loaded:', response);
    } catch (error) {
      console.error('❌ Failed to load flights:', error);
      toast.error('Failed to load flights');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const userData = {
        email: email.trim(),
        name: name.trim(),
        password: password.trim(),
        pnr: pnr.trim() || undefined,
        flightNumber: flightNumber.trim() || undefined
      };

      console.log('👤 Creating user with data:', userData);
      const response = await apiClient.createUser(userData, token);

      toast.success('User created successfully!');
      onSuccess();
      
      // Reset form
      setEmail('');
      setName('');
      setPassword('');
      setPnr('');
      setFlightNumber('');
    } catch (error) {
      console.error('❌ User creation failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/10 backdrop-blur-lg border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Users className="h-5 w-5 mr-2" />
          User Management
        </CardTitle>
        <CardDescription className="text-gray-300">
          Create new user accounts for passengers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-name" className="text-white">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="user-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-email" className="text-white">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="user-password" className="text-white">Password *</Label>
            <Input
              id="user-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-pnr" className="text-white">PNR (Optional)</Label>
              <Input
                id="user-pnr"
                value={pnr}
                onChange={(e) => setPnr(e.target.value)}
                placeholder="Enter PNR"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="user-flight" className="text-white">Flight (Optional)</Label>
              <select
                id="user-flight"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                className="w-full p-2 bg-white/10 border border-white/20 text-white rounded-md"
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

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
            disabled={isLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? 'Creating User...' : 'Create User'}
          </Button>
        </form>

        {/* Sample Users Info */}
        <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
          <h4 className="text-white font-semibold mb-2">Sample Users Available:</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Email:</strong> john.doe@example.com | <strong>Password:</strong> user123</p>
            <p><strong>Email:</strong> jane.smith@example.com | <strong>Password:</strong> user123</p>
            <p><strong>Email:</strong> mike.johnson@example.com | <strong>Password:</strong> user123</p>
            <p className="text-gray-400 text-xs mt-2">These users have sample baggage data for testing</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}