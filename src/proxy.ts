import { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';

const handleIntl = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleIntl(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - API routes (/api)
    // - Static files (_next/static, _next/image, favicon.ico, images, public files)
    // - Metadata files (sitemap.xml, robots.txt)
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ]
};
