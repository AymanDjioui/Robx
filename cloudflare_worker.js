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

    // IMPORTANT: env.ADBLUEMEDIA_API_KEY and env.ADBLUEMEDIA_USER_ID must be stored securely in your Cloudflare Worker Settings!
    const apiKey = env.ADBLUEMEDIA_API_KEY;
    const userId = env.ADBLUEMEDIA_USER_ID;

    if (!apiKey || !userId) {
      return new Response(JSON.stringify({ error: "Cloudflare Worker configuration error: Missing ADBLUEMEDIA_API_KEY or ADBLUEMEDIA_USER_ID in environment variables." }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // 2. Fetch from AdBlueMedia secure API
    const adBlueMediaUrl = `https://de6jvomfbm0af.cloudfront.net/public/offers/feed.php?user_id=${encodeURIComponent(userId)}&api_key=${encodeURIComponent(apiKey)}&ip=${encodeURIComponent(ip)}&user_agent=${encodeURIComponent(userAgent)}`;

    try {
      const apiResponse = await fetch(adBlueMediaUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json"
        }
      });
      let data;
      const textResponse = await apiResponse.text();
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        // If it's not JSON, it might be an error string like "Auth error"
        return new Response(JSON.stringify({ error: textResponse || "Invalid response format from AdBlueMedia" }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });
      }

      // 3. Return the AdBlueMedia JSON perfectly back to index.html with CORS unlocked!
      return new Response(JSON.stringify(data), {
        status: apiResponse.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Failed to connect to AdBlueMedia backend." }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};
