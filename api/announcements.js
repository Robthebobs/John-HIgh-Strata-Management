// Vercel serverless function for announcements
export default function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Mock announcements data
  // In a real application, this would come from a database
  const announcements = [
    {
      id: 1,
      title: "System Maintenance",
      content: "Scheduled maintenance this weekend from 2 AM to 4 AM AEST",
      date: "2024-03-20",
      priority: "high"
    },
    {
      id: 2,
      title: "New Feature Release",
      content: "Check out our new dashboard features!",
      date: "2024-03-19",
      priority: "medium"
    },
    {
      id: 3,
      title: "Office Update",
      content: "Sydney office will be having a team building day next Friday",
      date: "2024-03-18",
      priority: "low"
    }
  ];

  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  return res.status(200).json(announcements);
} 