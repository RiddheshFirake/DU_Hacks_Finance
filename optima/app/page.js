"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-10 text-white">
      <Toaster />
      <motion.h1 
        className="text-5xl font-extrabold mb-4 drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Budget Manager
      </motion.h1>
      <motion.p 
        className="text-lg max-w-xl text-center mb-8 opacity-90"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Take control of your finances with a simple, powerful budgeting tool designed to help you manage your money effortlessly.
      </motion.p>
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Link href="/sign-in">
          <Button 
            variant="primary" 
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-lg hover:bg-gray-200 transition"
          >
            Get Started
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
