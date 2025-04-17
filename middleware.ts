import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from './lib/supabase/middleware';

export async function middleware(req: NextRequest) {
    return await updateSession(req);
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/:path*'],
};
