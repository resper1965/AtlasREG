/**
 * AtlasReg Trigger Ingest Worker
 * Recebe requests e envia para Cloudflare Queue
 * 
 * Deploy: wrangler deploy
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ 
        status: 'ok', 
        service: 'atlasreg-trigger-ingest' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Apenas POST no endpoint /trigger
    if (url.pathname !== '/trigger' || request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        error: 'Invalid endpoint or method',
        usage: 'POST /trigger' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validar auth
    const authHeader = request.headers.get('Authorization');
    if (authHeader !== `Bearer ${env.API_SECRET}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
      
      // Validar payload
      if (!body.type) {
        return new Response(JSON.stringify({ 
          error: 'Missing required field: type' 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const message = {
        type: body.type,
        date: body.date || new Date().toISOString().split('T')[0],
        run_id: body.run_id || `run-${Date.now()}`,
        sources: body.sources || null,
        params: body.params || {},
        timestamp: Date.now(),
      };
      
      // Enviar para Cloudflare Queue
      await env.INGEST_QUEUE.send(message);

      console.log('Message queued:', message.run_id);

      return new Response(JSON.stringify({
        status: 'queued',
        run_id: message.run_id,
        message: 'Ingest triggered successfully',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Queue error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to queue message',
        message: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },

  /**
   * Cron trigger - Roda diariamente às 6h UTC
   * Para habilitar: Uncomment a linha [triggers] no wrangler.toml
   */
  async scheduled(event, env, ctx) {
    try {
      const message = {
        type: 'start_daily_ingest',
        date: new Date().toISOString().split('T')[0],
        run_id: `daily-${Date.now()}`,
        timestamp: Date.now(),
      };

      await env.INGEST_QUEUE.send(message);
      console.log('Daily ingest triggered:', message.run_id);
    } catch (error) {
      console.error('Cron error:', error);
    }
  },
};

