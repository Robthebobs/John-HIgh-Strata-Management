export default async function handler(req, res) {
  try {
    // Get current time in Australia/Sydney timezone
    const sydneyTime = new Date().toLocaleString('en-US', {
      timeZone: 'Australia/Sydney'
    });
    
    const sydneyDate = new Date(sydneyTime);
    const hours = sydneyDate.getHours();
    
    // Check if time is between 9 PM (21:00) and 6 AM (06:00)
    const isAfterHours = hours >= 21 || hours < 6;

    if (!isAfterHours) {
      return res.status(200).json({
        allowed: true,
        message: 'Welcome! We are open for business.'
      });
    } else {
      // Calculate next opening time
      let nextOpeningTime;
      if (hours >= 21) {
        // If after 9 PM, we open at 6 AM tomorrow
        nextOpeningTime = '6:00 AM tomorrow';
      } else {
        // If before 6 AM, we open at 6 AM today
        nextOpeningTime = '6:00 AM today';
      }

      return res.status(403).json({
        allowed: false,
        message: 'We are currently closed',
        currentTime: sydneyTime,
        nextOpening: nextOpeningTime,
        timeZone: 'Australia/Sydney'
      });
    }
  } catch (error) {
    console.error('Time check failed:', error);
    return res.status(500).json({
      allowed: false,
      message: 'Failed to verify business hours',
      error: error.message
    });
  }
} 