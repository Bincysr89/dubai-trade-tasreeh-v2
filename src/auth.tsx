import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const STORAGE_KEY = 'dt-auth';

export function isAuthenticated(): boolean {
  try {
    return typeof sessionStorage !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAuthenticated(value: boolean) {
  try {
    if (value) sessionStorage.setItem(STORAGE_KEY, 'true');
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/**
 * Route guard — redirects to /login when the password gate hasn't been passed,
 * preserving the originally-requested path so we can return after sign-in.
 */
export function RequireAuth({ children }: { children: React.ReactElement }) {
  const location = useLocation();
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return children;
}
