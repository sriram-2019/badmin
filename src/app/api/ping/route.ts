import { NextResponse } from 'next/server';

/**
 * Ping endpoint to keep the service alive
 * This endpoint can be called by uptime monitors (UptimeRobot, cron-jobs, etc.)
 * to prevent the service from sleeping on Render's free tier
 */
export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    message: 'Service is alive',
    timestamp: new Date().toISOString(),
  });
}

