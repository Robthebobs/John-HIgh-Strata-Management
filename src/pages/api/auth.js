export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      {
        status: 405,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }

  try {
    const { userId, password } = await req.json();
    
    const validUserId = process.env.VALID_USER_ID;
    const validPassword = process.env.VALID_PASSWORD;

    if (userId === validUserId && password === validPassword) {
      return new Response(
        JSON.stringify({ 
          success: true,
          message: 'Login successful'
        }),
        {
          status: 200,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    } else {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: 'Invalid credentials'
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false,
        message: 'Server error'
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  }
} 