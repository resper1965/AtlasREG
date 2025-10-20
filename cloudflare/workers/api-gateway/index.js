/**
 * AtlasReg API Gateway Worker
 * Roteia requests para backend FastAPI no VPS
 * 
 * Deploy: wrangler deploy
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', service: 'atlasreg-api-gateway' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Proxy para backend FastAPI no VPS
    const backendUrl = `${env.BACKEND_URL}${url.pathname}${url.search}`;
    
    try {
      const response = await fetch(backendUrl, {
        method: request.method,
        headers: request.headers,
        body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
      });

      const responseBody = await response.text();
      
      return new Response(responseBody, {
        status: response.status,
        headers: { 
          ...corsHeaders, 
          'Content-Type': response.headers.get('Content-Type') || 'application/json',
        },
      });
    } catch (error) {
      console.error('API Gateway error:', error);
      return new Response(JSON.stringify({ 
        error: 'Backend unavailable',
        message: error.message 
      }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

