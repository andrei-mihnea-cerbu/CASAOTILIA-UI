import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useState,
} from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Box, Fade } from '@mui/material';
import { useLocation } from 'react-router-dom';

const TOKEN_KEY = 'amc-jwt-token';
const apiUrl = import.meta.env.VITE_API_URL;

type DecodedJWT = {
  sub: string;
  role: string;
  exp: number;
};

type SessionContextType = {
  refresh: () => Promise<void>;
  logout: () => void;
  setJwtToken: (jwt: string) => void;
  getAuthHeaders: () => Record<string, string>;
  getToken: () => string | null;
  getUserId: () => string | null;
  getRole: () => string | null;
  getExp: () => number | null;
};

const SessionContext = createContext<SessionContextType>({
  refresh: async () => {},
  logout: () => {},
  setJwtToken: () => {},
  getAuthHeaders: () => ({}),
  getToken: () => null,
  getUserId: () => null,
  getRole: () => null,
  getExp: () => null,
});

export const useSession = () => useContext(SessionContext);

const loadToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

const decodeToken = (): DecodedJWT | null => {
  const token = loadToken();
  if (!token) return null;

  try {
    const decoded = jwtDecode<DecodedJWT>(token);
    if (decoded.exp * 1000 < Date.now()) return null;
    return decoded;
  } catch {
    return null;
  }
};

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();

  const logout = useCallback(() => {
    const token = loadToken();
    localStorage.removeItem(TOKEN_KEY);
    const pathname = location.pathname;

    if (!token) {
      // No token at all
      if (
        pathname.startsWith('/rewards') ||
        pathname.startsWith('/artist-portal')
      ) {
        return;
      }
    }

    if (pathname === '/admin') {
      // do nothing, already at admin root
    } else if (pathname.startsWith('/admin/')) {
      window.location.href = '/admin';
    } else if (
      pathname.startsWith('/rewards') ||
      pathname.startsWith('/artist-portal')
    ) {
      window.location.reload();
    } else {
      // all other paths, do nothing
    }
  }, [location.pathname]);

  const setJwtToken = useCallback((jwt: string) => {
    localStorage.setItem(TOKEN_KEY, jwt);
  }, []);

  const refresh = useCallback(async () => {
    try {
      const existing = loadToken();
      if (!existing) return;

      const decoded = jwtDecode<DecodedJWT>(existing);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return;
      }

      const res = await axios.post<{ jwtToken: string }>(
        `${apiUrl}/auth/refresh`,
        null,
        {
          headers: {
            Authorization: `Bearer ${existing}`,
          },
        }
      );

      setJwtToken(res.data.jwtToken);
    } catch {
      logout();
    }
  }, [setJwtToken, logout]);

  const getAuthHeaders = () => {
    const token = loadToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const getToken = () => loadToken();

  const getUserId = () => {
    const decoded = decodeToken();
    return decoded ? decoded.sub : null;
  };

  const getRole = () => {
    const decoded = decodeToken();
    return decoded ? decoded.role : null;
  };

  const getExp = () => {
    const decoded = decodeToken();
    return decoded ? decoded.exp : null;
  };

  useEffect(() => {
    setTimeout(() => setShowContent(true), 200);
  }, []);

  useEffect(() => {
    const checkSession = () => {
      const token = getToken();
      if (!token) {
        logout();
        return;
      }

      const exp = getExp();
      const timeLeft = exp ? exp * 1000 - Date.now() : -1;

      if (timeLeft <= 0) {
        logout();
        return;
      }

      refresh();
    };

    checkSession();
    const interval = setInterval(checkSession, 5_000);
    return () => clearInterval(interval);
  }, [getExp, getToken, logout, refresh]);

  return (
    <SessionContext.Provider
      value={{
        refresh,
        logout,
        setJwtToken,
        getAuthHeaders,
        getToken,
        getUserId,
        getRole,
        getExp,
      }}
    >
      <Fade in={showContent} timeout={400}>
        <Box>{children}</Box>
      </Fade>
    </SessionContext.Provider>
  );
};
