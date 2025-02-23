import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  try {
    const { userInput } = await req.json(); // Get user input from request body
    const API_KEY = "AIzaSyD7rekRWQSRE5rcIwavFlP9_O9AnrfxvVA"; // Replace with your actual API key

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        contents: [{ parts: [{ text: `Provide financial advice: ${userInput}` }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return NextResponse.json(response.data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch advice" }, { status: 500 });
  }
}
