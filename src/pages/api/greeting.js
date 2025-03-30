export default async function handler(req, res) {
  try {
    // Get client IP from various possible headers
    const clientIP = 
      req.headers['x-forwarded-for']?.split(',')[0] || 
      req.headers['cf-connecting-ip'] ||
      req.socket.remoteAddress;

    // Make request to ipapi.co for geolocation data
    const response = await fetch(`https://ipapi.co/${clientIP}/json/`);
    const data = await response.json();

    // Check if country code is AU (Australia)
    const isAustralian = data.country_code === 'AU';

    return res.status(200).json({
      greeting: isAustralian ? "G'day" : "Hello there",
      country: data.country_code
    });
  } catch (error) {
    console.error('Location check failed:', error);
    return res.status(200).json({
      greeting: "Hello there",  // Default greeting on error
      country: null
    });
  }
} 