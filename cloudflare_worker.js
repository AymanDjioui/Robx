export default {
  async fetch(request, env) {
    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        }
      });
    }

    // 1. Get the frontend URL params (ip and user_agent)
    const url = new URL(request.url);
    const ip = url.searchParams.get("ip");
    const userAgent = url.searchParams.get("user_agent");

    if (!ip || !userAgent) {
      return new Response(JSON.stringify({ error: "Missing ip or user_agent params" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 2. Fetch from OGAds secure API
    const ogAdsUrl = `https://checkmyapp.space/api/v2?ip=${encodeURIComponent(ip)}&user_agent=${encodeURIComponent(userAgent)}`;
    
    // IMPORTANT: env.OGADS_API_KEY must be stored securely in your Cloudflare Worker Settings!
    const apiKey = env.OGADS_API_KEY; 

    try {
      const apiResponse = await fetch(ogAdsUrl, {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + apiKey,
          "Accept": "application/json"
        }
      });

      const data = await apiResponse.json();

      // 3. Return the OGAds JSON perfectly back to index.html with CORS unlocked!
      return new Response(JSON.stringify(data), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to connect to OGAds backend." }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};
