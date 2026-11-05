/**
 * useAuth
 * Kayıt / giriş işlemleri ve token yönetimi.
 */
import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthAPI, setAuthToken } from '../utils/api';
import { useAppStore } from '../store/useAppStore';

const TOKEN_KEY = '@fg_token';
const VIP_KEY   = '@fg_vip';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  displayName: string | null;
}

interface UseAuthResult extends AuthState {
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

let _authState: AuthState = {
  isLoggedIn: false,
  userId: null,
  displayName: null,
};

export function useAuth(): UseAuthResult {
  const { toggleVip, isVip } = useAppStore();
  const [state, setState] = useState<AuthState>(_authState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applySession = useCallback(
    (token: string, userId: string, displayName: string, vip: boolean) => {
      setAuthToken(token);
      _authState = { isLoggedIn: true, userId, displayName };
      setState(_authState);
      if (vip && !isVip) toggleVip();
      if (!vip && isVip) toggleVip();
    },
    [isVip, toggleVip]
  );

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await AuthAPI.login(email, password);
        await AsyncStorage.multiSet([
          [TOKEN_KEY, data.token],
          [VIP_KEY, String(data.isVip)],
        ]);
        applySession(data.token, data.userId, data.displayName, data.isVip);
        return true;
      } catch (err: any) {
        setError(err?.response?.data?.error ?? 'Giriş başarısız');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [applySession]
  );

  const register = useCallback(
    async (email: string, password: string, displayName: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await AuthAPI.register(email, password, displayName);
        await AsyncStorage.multiSet([
          [TOKEN_KEY, data.token],
          [VIP_KEY, 'false'],
        ]);
        applySession(data.token, data.userId, data.displayName, false);
        return true;
      } catch (err: any) {
        setError(err?.response?.data?.error ?? 'Kayıt başarısız');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [applySession]
  );

  const logout = useCallback(async () => {
    setAuthToken(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, VIP_KEY]);
    _authState = { isLoggedIn: false, userId: null, displayName: null };
    setState(_authState);
    if (isVip) toggleVip();
  }, [isVip, toggleVip]);

  const restoreSession = useCallback(async () => {
    try {
      const [[, token], [, vipStr]] = await AsyncStorage.multiGet([TOKEN_KEY, VIP_KEY]);
      if (token) {
        setAuthToken(token);
        // Minimal restore — display name will come from /me if needed
        _authState = { isLoggedIn: true, userId: null, displayName: null };
        setState(_authState);
        if (vipStr === 'true' && !isVip) toggleVip();
      }
    } catch {
      // No stored session
    }
  }, [isVip, toggleVip]);

  return { ...state, isLoading, error, login, register, logout, restoreSession };
}
