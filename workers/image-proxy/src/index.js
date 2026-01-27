export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Security: Only allow requests for our account hash (VXLIc7g8zCNPFDQiYCuvsg)
    if (!url.pathname.includes("VXLIc7g8zCNPFDQiYCuvsg")) {
      return new Response("Unauthorized Proxy Usage", { status: 403 });
    }

    const targetUrl = new URL(url.pathname, 'https://imagedelivery.net');
    const response = await fetch(targetUrl.toString(), {
      headers: request.headers,
      cf: {
        cacheTtl: 31536000,
        cacheEverything: true
      }
    });
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    newResponse.headers.set('X-Image-Proxy', 'Active');

    return newResponse;
  }
};
