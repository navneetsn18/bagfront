"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Luggage, Scan, Shield, Zap, Globe, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Luggage className="h-8 w-8 text-cyan-400" />
            <span className="text-2xl font-bold text-white">
              BaggageTrack Pro
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/login">
              <Button className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-8 py-2 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                Login
              </Button>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20">
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight"
          >
            Track Your
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              {" "}
              Baggage
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Experience the future of baggage tracking with real-time updates, QR
            code scanning, and intelligent monitoring across all airport
            checkpoints.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
          >
            <Link href="/track">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Track Baggage 🧳
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-slate-900 px-12 py-4 rounded-full text-lg font-semibold transition-all duration-300"
              >
                Login Portal 🔑
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="grid md:grid-cols-3 gap-8 mb-20"
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 rounded-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <Scan className="h-12 w-12 text-cyan-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              QR Code Scanning
            </h3>
            <p className="text-gray-300">
              Instant updates with QR code scanning at every checkpoint for
              real-time tracking.
            </p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 rounded-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <Shield className="h-12 w-12 text-purple-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Secure Tracking
            </h3>
            <p className="text-gray-300">
              Advanced security measures ensure your baggage data is protected
              and accessible only to you.
            </p>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-8 rounded-2xl hover:bg-white/15 transition-all duration-300 transform hover:scale-105">
            <Zap className="h-12 w-12 text-yellow-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">
              Real-time Updates
            </h3>
            <p className="text-gray-300">
              Get instant notifications and updates as your baggage moves
              through the airport system.
            </p>
          </Card>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="grid md:grid-cols-3 gap-8 text-center mb-20"
        >
          <div>
            <div className="text-4xl md:text-6xl font-bold text-cyan-400 mb-2">
              99.9%
            </div>
            <div className="text-gray-300 text-lg">Tracking Accuracy</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-bold text-purple-400 mb-2">
              24/7
            </div>
            <div className="text-gray-300 text-lg">Real-time Monitoring</div>
          </div>
          <div>
            <div className="text-4xl md:text-6xl font-bold text-yellow-400 mb-2">
              10+
            </div>
            <div className="text-gray-300 text-lg">Airport Locations</div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Luggage className="h-6 w-6 text-cyan-400" />
              <span className="text-white font-semibold">BaggageTrack Pro</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 BaggageTrack Pro. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
