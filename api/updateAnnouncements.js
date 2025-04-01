// Simulated database of announcements
let announcements = [
  {
    id: '1',
    title: 'System Maintenance',
    content: 'System will be down for maintenance this weekend.',
    date: '2024-03-20',
    priority: 'high'
  },
  {
    id: '2',
    title: 'New Feature Release',
    content: 'Check out our latest features in the portal.',
    date: '2024-03-19',
    priority: 'medium'
  }
];

const validateAnnouncement = (announcement) => {
  const requiredFields = ['title', 'content', 'priority'];
  for (const field of requiredFields) {
    if (!announcement[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  if (!['low', 'medium', 'high'].includes(announcement.priority.toLowerCase())) {
    throw new Error('Invalid priority level. Must be low, medium, or high');
  }

  return true;
};

const authenticateRequest = (req) => {
  const authToken = req.headers.authorization;
  
  if (!authToken || !authToken.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization token');
  }

  // In production, verify the token against your auth service
  const token = authToken.split(' ')[1];
  if (token !== process.env.ADMIN_API_TOKEN) {
    throw new Error('Invalid authorization token');
  }

  return true;
};

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Authenticate all requests
    authenticateRequest(req);

    switch (req.method) {
      case 'GET':
        // Return all announcements
        res.status(200).json({ announcements });
        break;

      case 'POST':
        // Add new announcement
        const newAnnouncement = {
          id: Date.now().toString(),
          date: new Date().toISOString().split('T')[0],
          ...req.body
        };

        validateAnnouncement(newAnnouncement);
        announcements.unshift(newAnnouncement);
        res.status(201).json({ announcement: newAnnouncement });
        break;

      case 'PUT':
        // Update existing announcement
        const { id } = req.query;
        const updateIndex = announcements.findIndex(a => a.id === id);
        
        if (updateIndex === -1) {
          res.status(404).json({ error: 'Announcement not found' });
          return;
        }

        const updatedAnnouncement = {
          ...announcements[updateIndex],
          ...req.body,
          id // Prevent ID from being changed
        };

        validateAnnouncement(updatedAnnouncement);
        announcements[updateIndex] = updatedAnnouncement;
        res.status(200).json({ announcement: updatedAnnouncement });
        break;

      case 'DELETE':
        // Delete announcement
        const { id: deleteId } = req.query;
        const initialLength = announcements.length;
        announcements = announcements.filter(a => a.id !== deleteId);

        if (announcements.length === initialLength) {
          res.status(404).json({ error: 'Announcement not found' });
          return;
        }

        res.status(200).json({ message: 'Announcement deleted successfully' });
        break;

      default:
        res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling announcement:', error);
    res.status(error.message.includes('Missing') ? 400 : 500).json({
      error: error.message || 'Internal server error'
    });
  }
} 