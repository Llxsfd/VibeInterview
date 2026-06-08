export const AUTH_TOKEN_STORAGE_KEY = "smart-interview-token";
export const AUTH_COOKIE_NAME = "smart_interview_token";

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export type AuthResponse = {
  access_token: string;
  token_type: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
  profile: {
    id: string;
    user_id: string;
    target_role: string;
    target_level: string;
    preparation_days: number;
    current_level: string;
    progress: Record<string, unknown>;
    mastery_summary: Record<string, unknown>;
  };
};

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return window.localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0; SameSite=Lax`;
}
