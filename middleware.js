import { NextResponse } from 'next/server';

export const config = {
  matcher: '/api/greeting',
};

export default async function middleware(request) {
  try {
    // Get country from Vercel's geolocation headers
    const country = request.geo?.country || 'UNKNOWN';
    
    // Create response with greeting based on location
    const response = NextResponse.json({
      greeting: country === 'AU' ? "G'day" : "Hello there",
      country: country
    });

    return response;
  } catch (error) {
    return NextResponse.json({
      greeting: "Hello there",
      country: null
    });
  }
} 