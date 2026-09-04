import { Response } from 'express';

export type RealtimeEventName = 'application.changed' | 'whatsapp.status';

/**
 * A small SSE broker.  SSE is deliberately used instead of polling: it works
 * through ordinary HTTPS proxies and requires no extra websocket service.
 */
class RealtimeEvents {
  private clients = new Set<Response>();

  subscribe(res: Response): void {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    });
    res.write('retry: 3000\n\n');
    this.clients.add(res);
    res.on('close', () => this.clients.delete(res));
  }

  publish(event: RealtimeEventName, payload: Record<string, unknown> = {}): void {
    const message = `event: ${event}\ndata: ${JSON.stringify({ ...payload, emittedAt: new Date().toISOString() })}\n\n`;
    for (const client of this.clients) {
      try { client.write(message); } catch { this.clients.delete(client); }
    }
  }
}

export const realtimeEvents = new RealtimeEvents();
