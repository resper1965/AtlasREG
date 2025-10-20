/**
 * AtlasReg Webhook Receiver
 * Recebe notificações do Orchestrator após processamento
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
        service: 'atlasreg-webhook-receiver' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Apenas POST no endpoint /hooks/ingest-complete
    if (url.pathname !== '/hooks/ingest-complete' || request.method !== 'POST') {
      return new Response(JSON.stringify({ 
        error: 'Invalid endpoint or method' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.text();
      const signature = request.headers.get('X-Signature');
      
      if (!signature) {
        return new Response(JSON.stringify({ error: 'Missing signature' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Validar HMAC signature
      const encoder = new TextEncoder();
      const keyData = encoder.encode(env.HMAC_SECRET);
      const messageData = encoder.encode(body);
      
      const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );
      
      const signatureBuffer = await crypto.subtle.sign('HMAC', key, messageData);
      const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      if (signature !== expectedSignature) {
        console.error('Invalid signature');
        return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const data = JSON.parse(body);
      
      console.log('Ingest completed:', {
        run_id: data.run_id,
        status: data.status,
        files: data.files_generated?.length || 0,
      });
      
      // Salvar status no KV
      if (env.STATUS_KV && data.run_id) {
        await env.STATUS_KV.put(
          `ingest:${data.run_id}`,
          JSON.stringify({
            status: data.status,
            timestamp: data.timestamp,
            date: data.date,
            files_generated: data.files_generated || [],
            duration_seconds: data.duration_seconds,
            stats: data.stats || {},
          }),
          { expirationTtl: 86400 * 7 } // 7 dias
        );
      }

      // Aqui você pode adicionar mais lógica:
      // - Enviar notificação email/slack
      // - Trigger outro Worker
      // - Atualizar dashboard
      
      return new Response(JSON.stringify({ 
        received: true,
        run_id: data.run_id 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Webhook error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to process webhook',
        message: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

