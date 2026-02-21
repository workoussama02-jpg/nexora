// API route for InsForge auth — enables SSR cookie-based authentication
import { createAuthRouteHandlers } from '@insforge/nextjs/api';

const handlers = createAuthRouteHandlers({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_BASE_URL || 'https://5bbwbmvx.us-east.insforge.app',
});

export const POST = handlers.POST;
export const GET = handlers.GET;
export const DELETE = handlers.DELETE;
