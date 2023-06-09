/* eslint-disable prefer-destructuring */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const innerLocales = ['en', 'ua'];

const locales = [
  [
    'en',
    'eng',
  ],
  [
    'ua',
    'uk',
  ],
];

function getLocale(request: NextRequest) {
  const headerLangs = request.headers.get('Accept-Language');
  if (!headerLangs) {
    return 'en';
  }
  let result: string | null = null;
  headerLangs.split(',').forEach((lang) => {
    if (result) {
      return;
    }
    locales.forEach((locale) => {
      if (result) {
        return;
      }
      if (locale.includes(lang.slice(0, 2))) {
        result = locale[0];
      }
    });
  });

  if (!result) {
    return 'en';
  }

  return result;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameIsMissingLocale = innerLocales.every(
    (locale) => !pathname.includes(`/${locale}/`) && !pathname.endsWith(`/${locale}`),
  );

  const pageIsMissing = innerLocales.every(
    (locale) => (pathname !== `/${locale}/` && pathname !== `/${locale}`),
  );

  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    return NextResponse.redirect(
      new URL(`${locale}/${pathname}`, request.url),
    );
  }

  if (pageIsMissing) {
    const locale = pathname.split('/')[1];

    return NextResponse.redirect(
      new URL(`/${locale}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.png|images).*)',
  ],
};
