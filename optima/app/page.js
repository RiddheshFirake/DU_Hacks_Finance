"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Wallet, PieChart, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl border border-white border-opacity-20 text-white hover:transform hover:scale-105 transition-all duration-300">
    <div className="flex items-center gap-4 mb-3">
      <div className="p-2 bg-white bg-opacity-20 rounded-lg">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-sm opacity-80">{description}</p>
  </div>
);

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    {
      icon: Wallet,
      title: "Smart Budgeting",
      description: "Set and track budgets with intelligent categorization and real-time updates."
    },
    {
      icon: PieChart,
      title: "Visual Analytics",
      description: "Understand your spending patterns with beautiful, interactive charts."
    },
    {
      icon: TrendingUp,
      title: "Goal Tracking",
      description: "Set financial goals and track your progress with automated insights."
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your financial data is encrypted and protected with bank-level security."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full transition-all duration-300 ${
        scrolled ? "bg-white bg-opacity-10 backdrop-blur-md shadow-lg" : ""
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-white font-bold text-xl">Optima</div>
          <div className="space-x-4">
            <Link href="/sign-in">
            <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-10">
              Features
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white hover:bg-opacity-10">
              Pricing
            </Button>
            <Button className="bg-white hover:bg-gray-100 text-blue-600">
              Sign In
            </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl font-bold text-white mb-6 leading-tight">
            Master Your Money with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              Smart Budgeting
            </span>
          </h1>
          <p className="text-xl text-white text-opacity-90 max-w-2xl mx-auto mb-12">
            Take control of your finances with our powerful budgeting tool. Track expenses,
            set goals, and watch your savings grow with intelligent insights.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/sign-in">
            <Button 
              className="bg-indigo-500 hover:bg-indigo-600 text-white text-lg px-8 py-6 rounded-xl flex items-center gap-2"
            >
              Get Started Free
              <ChevronRight className="w-5 h-5" />
            </Button>
            </Link>
            <Button 
              variant="outline" 
              className="border-2 border-white text-black hover:bg-white hover:bg-opacity-10 text-lg px-8 py-6 rounded-xl"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white bg-opacity-10 backdrop-blur-lg py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div className="p-6 rounded-xl backdrop-blur-lg">
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-white text-opacity-80">Active Users</div>
            </div>
            <div className="p-6 rounded-xl backdrop-blur-lg">
              <div className="text-4xl font-bold text-white mb-2">$2M+</div>
              <div className="text-white text-opacity-80">Budget Managed</div>
            </div>
            <div className="p-6 rounded-xl backdrop-blur-lg">
              <div className="text-4xl font-bold text-white mb-2">4.9/5</div>
              <div className="text-white text-opacity-80">User Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}