"use client";

import { useState } from "react";
import Sidebar from "../_components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export default function AdvisoryPage() {
  const [userInput, setUserInput] = useState("");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const formatResponse = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  const getAdvice = async () => {
    if (!userInput.trim()) {
      setError("⚠️ Please enter a financial query.");
      return;
    }

    setLoading(true);
    setAdvice("");
    setError("");

    try {
      const response = await axios.post("/api/gemini", { userInput });

      const generatedText =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No advice available. Please try again.";

      setAdvice(formatResponse(generatedText));
    } catch (error) {
      console.error("Error fetching advice:", error);
      setError("❌ Failed to get advice. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-500 to-purple-700 text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="bg-white text-gray-900 p-6 rounded-xl shadow-lg w-full max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-purple-700 mb-4">📢 Financial Advisor</h1>
          <p className="text-gray-600 text-center mb-6">Enter your financial query to get expert advice:</p>

          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="E.g., Suggest Financial Policies..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:ring focus:ring-purple-400"
            />
            <Button
              onClick={getAdvice}
              disabled={loading}
              className="bg-purple-600 text-white font-semibold px-5 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              {loading ? "🔄 Fetching..." : "Get Advice"}
            </Button>
          </div>

          {/* Error Message */}
          {error && <p className="mt-4 text-red-600 text-sm text-center">{error}</p>}

          {/* Advice Display */}
          {advice && (
            <div className="mt-6 p-6 bg-gradient-to-r from-purple-50 to-purple-200 border-l-4 border-purple-500 rounded-lg shadow-md">
              <h2 className="text-lg font-semibold text-purple-700 flex items-center gap-2">💡 Expert Advice:</h2>
              <p
                className="text-gray-700 mt-2 leading-relaxed whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: advice }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
