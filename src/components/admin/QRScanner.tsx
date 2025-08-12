'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Scan, Type } from 'lucide-react';
import { apiClient } from '@/lib/api';
import { toast } from 'sonner';

interface QRScannerProps {
  token: string;
  userLocation: string;
  onSuccess: () => void;
}

export default function QRScanner({ token, userLocation, onSuccess }: QRScannerProps) {
  const [manualId, setManualId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      console.log('🎥 Starting camera...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 640 },
          height: { ideal: 480 }
        } 
      });
      console.log('📹 Camera stream obtained:', stream);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        console.log('▶️ Video playing');
      }
      setIsScanning(true);
      toast.success('Camera started successfully');
    } catch (error) {
      console.error('❌ Camera error:', error);
      toast.error(`Failed to access camera: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
  };

  const handleScan = async (baggageId: string) => {
    if (!baggageId.trim()) {
      toast.error('Please enter a valid baggage ID');
      return;
    }

    setIsLoading(true);
    try {
      console.log('🔍 Scanning baggage ID:', baggageId.trim());
      const response = await apiClient.scanBaggage(baggageId.trim(), token);
      console.log('✅ Scan successful:', response);
      toast.success('Baggage scanned successfully!');
      onSuccess();
      setManualId('');
    } catch (error) {
      console.error('❌ Scan failed:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to scan baggage');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualScan = (e: React.FormEvent) => {
    e.preventDefault();
    handleScan(manualId);
  };

  // Get a real baggage ID from sample data for simulation
  const simulateQRDetection = async () => {
    try {
      console.log('🎯 Getting sample baggage for simulation...');
      // Get sample baggage data to use a real ID
      const response = await fetch('http://localhost:8000/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'ABC123', queryType: 'pnr' })
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const realBaggageId = data.results[0].id;
          console.log('✅ Using real baggage ID for simulation:', realBaggageId);
          handleScan(realBaggageId);
          return;
        }
      }
      
      // Fallback: show message that no baggage exists
      toast.error('No sample baggage found. Please register baggage first.');
    } catch (error) {
      console.error('❌ Failed to get sample baggage:', error);
      toast.error('Please register baggage first, then try scanning.');
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Scan className="h-5 w-5 mr-2" />
            QR Code Scanner
          </CardTitle>
          <CardDescription className="text-gray-300">
            Scan baggage QR codes to update location: {userLocation}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Camera Scanner */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold flex items-center">
              <Camera className="h-4 w-4 mr-2" />
              Camera Scanner
            </h3>
            
            {!isScanning ? (
              <div className="text-center">
                <Button
                  onClick={startCamera}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Start Camera
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    className="w-full h-64 object-cover"
                    autoPlay
                    playsInline
                    muted
                  />
                  <div className="absolute inset-0 border-2 border-cyan-400 rounded-lg pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-cyan-400 rounded-lg"></div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    onClick={simulateQRDetection}
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Simulate Scan'}
                  </Button>
                  <Button
                    onClick={stopCamera}
                    variant="outline"
                    className="border-red-400 text-red-400 hover:bg-red-400 hover:text-white"
                  >
                    Stop Camera
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Manual Entry */}
          <div className="border-t border-white/20 pt-6">
            <h3 className="text-white font-semibold flex items-center mb-4">
              <Type className="h-4 w-4 mr-2" />
              Manual Entry
            </h3>
            
            <form onSubmit={handleManualScan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-id" className="text-white">Baggage ID</Label>
                <Input
                  id="manual-id"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  placeholder="Enter baggage ID manually"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700"
                disabled={isLoading || !manualId.trim()}
              >
                {isLoading ? 'Processing...' : 'Scan Baggage'}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-white/10 backdrop-blur-lg border-white/20">
        <CardHeader>
          <CardTitle className="text-white text-lg">Scanning Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2 text-gray-300 text-sm">
              <p>• Position the QR code within the scanning frame</p>
              <p>• Ensure good lighting for better detection</p>
              <p>• Hold the device steady until the code is detected</p>
              <p>• Use manual entry if the camera scan fails</p>
              <p>• Each scan will update the baggage location to: <span className="text-cyan-400 font-semibold">{userLocation}</span></p>
            </div>
            
            {/* Test with Sample Data */}
            <div className="border-t border-white/20 pt-4">
              <h4 className="text-white font-semibold mb-2">Test with Sample Data:</h4>
              <div className="text-sm text-gray-300 space-y-1">
                <p>Use these sample baggage IDs for testing:</p>
                <div className="bg-white/5 p-2 rounded text-xs font-mono">
                  <p>PNR: ABC123 (2 bags)</p>
                  <p>PNR: DEF456 (1 bag)</p>
                  <p>PNR: GHI789 (3 bags)</p>
                </div>
                <p className="text-xs text-gray-400">Get actual baggage IDs from the Lookup tab</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}