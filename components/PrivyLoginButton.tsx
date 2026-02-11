/**
 * 钱包登录：Privy 弹窗登录后，将用户同步到后端并写入 points_user_id
 * 必须在 PrivyProvider 内使用（用 usePrivy）
 */
import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { getAPIBaseUrl } from '../services/api';
import { setPointsUserId } from '../services/api';

interface PrivyLoginButtonProps {
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
}

function usePrivyIfAvailable() {
  try {
    const { usePrivy } = require('@privy-io/react-auth');
    return usePrivy();
  } catch {
    return null;
  }
}

export function PrivyLoginButton({ onSuccess, className, children }: PrivyLoginButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [synced, setSynced] = useState(false);
  const privy = usePrivyIfAvailable();
  const authenticated = privy?.authenticated ?? false;
  const ready = privy?.ready ?? true;

  const syncToBackend = async () => {
    if (!privy?.authenticated) return;
    setError(null);
    setLoading(true);
    try {
      const p = privy as { getAccessToken?: () => Promise<string>; getIdentityToken?: () => Promise<string> };
      const token = await (p.getIdentityToken?.() ?? p.getAccessToken?.());
      if (!token) throw new Error('No token');
      const baseUrl = await getAPIBaseUrl();
      const res = await fetch(`${baseUrl}/auth/privy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_token: token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.user_id) {
        setPointsUserId(data.user_id);
        setSynced(true);
        onSuccess?.();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    if (!privy) {
      setError('未配置 Privy（VITE_PRIVY_APP_ID）');
      return;
    }
    setError(null);
    if (!privy.authenticated) {
      setLoading(true);
      try {
        await privy.login();
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Login failed');
      } finally {
        setLoading(false);
      }
      return;
    }
    await syncToBackend();
  };

  const privyAppId = import.meta.env.VITE_PRIVY_APP_ID as string | undefined;
  if (!privyAppId?.trim()) return null;

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-50"
      >
        <Wallet size={18} />
        {loading ? (authenticated ? '同步中…' : '登录中…') : authenticated ? '已登录，点击同步' : (children ?? 'Twitter / Google 登录')}
      </button>
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
}
