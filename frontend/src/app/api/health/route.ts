/**
 * Health check endpoint for Docker containers
 */
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      service: 'vitalgo-frontend',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0'
    },
    { status: 200 }
  );
}