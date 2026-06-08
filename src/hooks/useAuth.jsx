import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  getMe,
  login as loginRequest,
  logout as logoutRequest,
  register as registerRequest,
} from "@/services/auth.service";

const AuthContext = createContext(null);
const TOKEN_KEY = "cosy_auth_token";
const USER_CACHE_KEY = "cosy_auth_user";
const USER_CACHE_TTL_MS = 1000 * 60 * 60 * 24 * 30;

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(() => readCachedUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        setLoading(true);
        const userData = await getMe();

        if (active) setUser(userData);
      } catch (error) {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_CACHE_KEY);
        if (active) {
          setUserState(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, []);

  async function login(payload) {
    const data = await loginRequest(payload);

    setUser(data.user);

    return data.user;
  }

  async function register(payload) {
    const data = await registerRequest(payload);

    setUser(data.user);

    return data.user;
  }

  async function logout() {
    try {
      await logoutRequest();
    } catch (error) {
      // Local session still needs to be cleared if the network is unavailable.
    }

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_CACHE_KEY);
    setUserState(null);
  }

  function setUser(nextUser) {
    setUserState(nextUser);
    writeCachedUser(nextUser);
  }

  const value = useMemo(
    () => ({
      loading,
      login,
      logout,
      register,
      setUser,
      user,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function readCachedUser() {
  try {
    const rawCache = localStorage.getItem(USER_CACHE_KEY);
    if (!rawCache) return null;

    const cache = JSON.parse(rawCache);
    if (!cache.expires_at || cache.expires_at < Date.now()) {
      localStorage.removeItem(USER_CACHE_KEY);
      return null;
    }

    return cache.user || null;
  } catch (error) {
    localStorage.removeItem(USER_CACHE_KEY);
    return null;
  }
}

function writeCachedUser(user) {
  if (!user) {
    localStorage.removeItem(USER_CACHE_KEY);
    return;
  }

  localStorage.setItem(
    USER_CACHE_KEY,
    JSON.stringify({
      user,
      expires_at: Date.now() + USER_CACHE_TTL_MS,
    }),
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
