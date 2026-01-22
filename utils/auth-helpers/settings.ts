// utils/auth-helpers/settings.ts

export type AuthType = 'password' | 'email';
export type ViewType = 'signin' | 'signup';

export function getAuthTypes(): AuthType[] {
  return ['password', 'email'];
}

export function getViewTypes(): ViewType[] {
  return ['signin', 'signup'];
}

export function getDefaultSignInView(): ViewType {
  return 'signin';
}

export function getRedirectMethod(): 'client' | 'server' {
  return 'client';
}
