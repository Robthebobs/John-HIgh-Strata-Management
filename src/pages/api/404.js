export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  return new Response(
    JSON.stringify({
      status: 404,
      message: 'Page not found!!!',
    }),
    {
      status: 404,
      headers: {
        'content-type': 'application/json',
      },
    }
  );
} 