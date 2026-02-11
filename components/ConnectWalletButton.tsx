/**
 * 连接钱包登录：MetaMask 等 EVM 钱包，签名后以钱包地址为身份，积分记录在我们服务器
 * 不依赖 Privy，用户自己绑定自己的钱包地址
 */
import React, { useState } from 'react';
import { Wallet } from 'lucide-react';
import { getAPIBaseUrl } from '../services/api';
import { setPointsUserId } from '../services/api';

const LOGIN_MESSAGE_PREFIX = 'Login to AgentVerse. Timestamp: ';

interface ConnectWalletButtonProps {
  onSuccess?: () => void;
  className?: string;
  children?: React.ReactNode;
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

export function ConnectWalletButton({ onSuccess, className, children }: ConnectWalletButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    setLoading(true);
    try {
      const ethereum = window.ethereum;
      if (!ethereum) {
        setError('请安装 MetaMask 或其它 EVM 钱包扩展');
        return;
      }
      const accounts = (await ethereum.request({ method: 'eth_requestAccounts' })) as string[];
      const address = accounts[0];
      if (!address) {
        setError('未获取到钱包地址');
        return;
      }
      const message = LOGIN_MESSAGE_PREFIX + Date.now();
      const signature = (await ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      })) as string;
      const baseUrl = await getAPIBaseUrl();
      const res = await fetch(`${baseUrl}/auth/wallet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: address,
          message,
          signature,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data = await res.json();
      if (data.user_id) {
        setPointsUserId(data.user_id);
        onSuccess?.();
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : '连接失败';
      if (msg === 'Failed to fetch' || msg.toLowerCase().includes('fetch')) {
        const isLocal = typeof window !== 'undefined' && (window.location?.hostname === 'localhost' || window.location?.hostname === '127.0.0.1');
        setError(isLocal
          ? '无法连接后端。请先运行本地 API：npm run api 或 npm run dev:full'
          : '网络请求失败，请检查网络或稍后重试');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <button
        type="button"
        onClick={handleConnect}
        disabled={loading}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-50"
      >
        <Wallet size={18} />
        {loading ? '连接中…' : (children ?? '连接钱包（MetaMask）')}
      </button>
      {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
    </div>
  );
}
