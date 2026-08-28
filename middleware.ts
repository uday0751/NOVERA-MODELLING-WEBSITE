import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  const isModelRoute = pathname.startsWith('/model');
  const isClientRoute = pathname.startsWith('/client');
  const isAdminRoute = pathname.startsWith('/admin');
  const isProtectedRoute = isModelRoute || isClientRoute || isAdminRoute;

  if (isProtectedRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    // Fetch user profile role and status
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, status')
      .eq('user_id', user.id)
      .single();

    if (!profile) {
      const url = request.nextUrl.clone();
      url.pathname = '/pending-approval';
      return NextResponse.redirect(url);
    }

    // Check account status
    if (profile.status === 'pending' || profile.status === 'rejected' || profile.status === 'suspended') {
      const url = request.nextUrl.clone();
      url.pathname = '/pending-approval';
      return NextResponse.redirect(url);
    }

    // Role-based access protection
    if (isModelRoute && profile.role !== 'model') {
      const url = request.nextUrl.clone();
      url.pathname = profile.role === 'admin' ? '/admin/dashboard' : '/client/dashboard';
      return NextResponse.redirect(url);
    }

    if (isClientRoute && profile.role !== 'client') {
      const url = request.nextUrl.clone();
      url.pathname = profile.role === 'admin' ? '/admin/dashboard' : '/model/dashboard';
      return NextResponse.redirect(url);
    }

    if (isAdminRoute && profile.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = profile.role === 'client' ? '/client/dashboard' : '/model/dashboard';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/model/:path*',
    '/client/:path*',
    '/admin/:path*',
    '/pending-approval',
  ],
};
