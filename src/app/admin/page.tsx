"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Luggage,
  QrCode,
  Scan,
  Search,
  Plane,
  BarChart3,
  LogOut,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api";
import { DashboardStats } from "@/types";
import { toast } from "sonner";
import BaggageRegistration from "@/components/admin/BaggageRegistration";
import QRScanner from "@/components/admin/QRScanner";
import BaggageLookup from "@/components/admin/BaggageLookup";
import FlightBaggage from "@/components/admin/FlightBaggage";
import UserManagement from "@/components/admin/UserManagement";

export default function AdminDashboard() {
  const { user, token, logout } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !token || user.role !== "admin") {
      router.push("/login");
      return;
    }

    loadDashboardStats();
  }, [user, token, router]);

  const loadDashboardStats = async () => {
    if (!token) return;

    try {
      const response = await apiClient.getDashboardStats(token);
      setStats(response as DashboardStats);
    } catch (error) {
      toast.error("Failed to load dashboard stats");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Luggage className="h-8 w-8 text-cyan-400" />
              <span className="text-2xl font-bold text-white">
                Admin Dashboard
              </span>
            </div>
            <p className="text-gray-300">Welcome back, {user.name}</p>
            <p className="text-gray-400 text-sm">{user.location}</p>
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

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Total Baggage</p>
                    <p className="text-3xl font-bold text-white">
                      {stats.totalBaggage}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-cyan-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">In Progress</p>
                    <p className="text-3xl font-bold text-yellow-400">
                      {(stats.statusCounts.checked_in || 0) +
                        (stats.statusCounts.security_cleared || 0) +
                        (stats.statusCounts.loaded_on_aircraft || 0) +
                        (stats.statusCounts.in_transit || 0)}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Delivered</p>
                    <p className="text-3xl font-bold text-green-400">
                      {(stats.statusCounts.delivered || 0) +
                        (stats.statusCounts.arrived_at_destination || 0)}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-300 text-sm">Lost</p>
                    <p className="text-3xl font-bold text-red-400">
                      {stats.statusCounts.lost || 0}
                    </p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-400" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs defaultValue="register" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white/10 backdrop-blur-lg">
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-cyan-500"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Register
              </TabsTrigger>
              <TabsTrigger
                value="scan"
                className="data-[state=active]:bg-cyan-500"
              >
                <Scan className="h-4 w-4 mr-2" />
                Scan
              </TabsTrigger>
              <TabsTrigger
                value="lookup"
                className="data-[state=active]:bg-cyan-500"
              >
                <Search className="h-4 w-4 mr-2" />
                Lookup
              </TabsTrigger>
              <TabsTrigger
                value="flights"
                className="data-[state=active]:bg-cyan-500"
              >
                <Plane className="h-4 w-4 mr-2" />
                Flights
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="data-[state=active]:bg-cyan-500"
              >
                <Users className="h-4 w-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="data-[state=active]:bg-cyan-500"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="register">
              {token && (
                <BaggageRegistration
                  token={token}
                  onSuccess={loadDashboardStats}
                />
              )}
            </TabsContent>

            <TabsContent value="scan">
              {token && (
                <QRScanner
                  token={token}
                  userLocation={user.location || ""}
                  onSuccess={loadDashboardStats}
                />
              )}
            </TabsContent>

            <TabsContent value="lookup">
              {token && (
                <BaggageLookup token={token} onSuccess={loadDashboardStats} />
              )}
            </TabsContent>

            <TabsContent value="flights">
              {token && <FlightBaggage token={token} />}
            </TabsContent>

            <TabsContent value="users">
              {token && (
                <UserManagement token={token} onSuccess={loadDashboardStats} />
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Analytics Dashboard
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Comprehensive overview of baggage processing metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {stats && (
                      <div className="space-y-6">
                        {/* System Overview */}
                        <div>
                          <h3 className="text-white font-semibold mb-4">
                            System Overview
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white/5 p-4 rounded-lg text-center">
                              <p className="text-gray-300 text-sm">
                                Total Baggage
                              </p>
                              <p className="text-2xl font-bold text-cyan-400">
                                {stats.totalBaggage}
                              </p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg text-center">
                              <p className="text-gray-300 text-sm">
                                Total Flights
                              </p>
                              <p className="text-2xl font-bold text-purple-400">
                                {stats.totalFlights}
                              </p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg text-center">
                              <p className="text-gray-300 text-sm">
                                Total Users
                              </p>
                              <p className="text-2xl font-bold text-green-400">
                                {stats.totalUsers}
                              </p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg text-center">
                              <p className="text-gray-300 text-sm">
                                Total Admins
                              </p>
                              <p className="text-2xl font-bold text-yellow-400">
                                {stats.totalAdmins}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Status Distribution */}
                        <div>
                          <h3 className="text-white font-semibold mb-4">
                            Status Distribution
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Object.entries(stats.statusCounts).map(
                              ([status, count]) => (
                                <div
                                  key={status}
                                  className="bg-white/5 p-4 rounded-lg"
                                >
                                  <p className="text-gray-300 text-sm capitalize">
                                    {status.replace("_", " ")}
                                  </p>
                                  <p className="text-2xl font-bold text-white">
                                    {count}
                                  </p>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activities */}
                {stats && stats.recentActivities && (
                  <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">
                        Recent Activities
                      </CardTitle>
                      <CardDescription className="text-gray-300">
                        Latest baggage updates and tracking events
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {stats.recentActivities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                          >
                            <div
                              className={`w-2 h-2 rounded-full mt-2 ${
                                activity.type === "baggage_update"
                                  ? "bg-cyan-400"
                                  : "bg-purple-400"
                              }`}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <span className="text-white font-medium">
                                    {activity.passengerName}
                                  </span>
                                  <span className="text-gray-400 text-sm">
                                    ({activity.pnr})
                                  </span>
                                  <span className="text-gray-400 text-sm">
                                    •
                                  </span>
                                  <span className="text-gray-400 text-sm">
                                    {activity.flightNumber}
                                  </span>
                                </div>
                                <span className="text-gray-400 text-xs">
                                  {new Date(
                                    activity.timestamp
                                  ).toLocaleString()}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                <span
                                  className={`px-2 py-1 rounded text-xs font-semibold ${
                                    activity.status === "delivered"
                                      ? "bg-green-500/20 text-green-400"
                                      : activity.status === "lost"
                                      ? "bg-red-500/20 text-red-400"
                                      : activity.status === "in_transit"
                                      ? "bg-orange-500/20 text-orange-400"
                                      : "bg-blue-500/20 text-blue-400"
                                  }`}
                                >
                                  {activity.status
                                    .replace("_", " ")
                                    .toUpperCase()}
                                </span>
                                <span className="text-gray-300 text-sm">
                                  at {activity.location}
                                </span>
                              </div>
                              {activity.scannedBy && (
                                <p className="text-gray-400 text-xs mt-1">
                                  Scanned by: {activity.scannedBy} • Method:{" "}
                                  {activity.method?.replace("_", " ")}
                                </p>
                              )}
                              <p className="text-gray-400 text-xs mt-1">
                                Baggage ID: {activity.baggageId}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
