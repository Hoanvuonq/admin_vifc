import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'fallback-access-secret';

// Configure the middleware to only run on API routes
export const config = {
  matcher: ['/api/:path*'],
};

export async function proxy(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // Exclude auth routes from protection
  // if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/refresh')) {
    return NextResponse.next();
  // }

  // const authHeader = request.headers.get('authorization');

  // if (!authHeader || !authHeader.startsWith('Bearer ')) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       error: {
  //         code: 'UNAUTHORIZED',
  //         message: 'Missing or invalid Authorization header',
  //       },
  //     },
  //     { status: 401 }
  //   );
  // }

  // const token = authHeader.substring(7); // Remove 'Bearer '

  // try {
  //   const secret = new TextEncoder().encode(ACCESS_SECRET);
    
  //   // Verify the JWT token
  //   const { payload } = await jwtVerify(token, secret);

  //   // Ensure the user has the 'admin' role
  //   if (payload.role !== 'admin') {
  //     return NextResponse.json(
  //       {
  //         success: false,
  //         error: {
  //           code: 'ACCESS_DENIED',
  //           message: 'Access denied. Only administrators are allowed.',
  //         },
  //       },
  //       { status: 403 }
  //     );
  //   }

  //   // Pass the payload data to the request headers so downstream API routes can use it if needed
  //   const requestHeaders = new Headers(request.headers);
  //   requestHeaders.set('x-user-id', payload.id as string);
  //   requestHeaders.set('x-user-email', payload.email as string);
  //   requestHeaders.set('x-user-role', payload.role as string);

  //   return NextResponse.next({
  //     request: {
  //       headers: requestHeaders,
  //     },
  //   });
  // } catch (error: any) {
  //   console.error('Middleware JWT verification failed:', error.message);
    
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       error: {
  //         code: 'UNAUTHORIZED',
  //         message: error.code === 'ERR_JWT_EXPIRED' ? 'Token expired' : 'Invalid token',
  //       },
  //     },
  //     { status: 401 }
  //   );
  // }
}
