import { GoogleGenAI } from '@google/genai';
import { NextResponse } from 'next/server';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const PHATBIRD_CONTEXT = `You are a social media comment reply assistant for Phatbird, an online store selling luxury dresses and accessories. 
Tone: friendly, warm, conversational, never robotic. Keep replies concise (1-3 sentences max). 
Always end with a soft positive note. Never make up specific order/shipping details.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { comment } = body;

    const prompt = `${PHATBIRD_CONTEXT}\n\nPlease draft a short reply to this customer comment: "${comment}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return NextResponse.json({ reply: response.text });
  } catch (error) {
    console.error('Error generating reply:', error);
    return NextResponse.json({ error: 'Failed to generate reply' }, { status: 500 });
  }
}