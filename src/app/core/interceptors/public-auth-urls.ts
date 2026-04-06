export const PUBLIC_AUTH_URLS = [
  '/auth/login',
  '/auth/register',
  '/auth/google',
  '/auth/refresh',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/logout',
];

export function isPublicAuthUrl(url: string): boolean {
  return PUBLIC_AUTH_URLS.some((publicUrl) => url.includes(publicUrl));
}
