import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Coins, Copy, Check, UserPlus, Globe } from 'lucide-react';
import { pointsAPI, ensurePointsUser, type PointsUser } from '../services/api';
import { ConnectWalletButton } from './ConnectWalletButton';
import { PrivyLoginButton } from './PrivyLoginButton';

const COUNTRY_OPTIONS: { code: string; name: string }[] = [
  { code: 'CN', name: '中国' }, { code: 'US', name: '美国' }, { code: 'SG', name: '新加坡' }, { code: 'MY', name: '马来西亚' },
  { code: 'CA', name: '加拿大' }, { code: 'AU', name: '澳大利亚' }, { code: 'GB', name: '英国' }, { code: 'JP', name: '日本' },
  { code: 'KR', name: '韩国' }, { code: 'DE', name: '德国' }, { code: 'FR', name: '法国' }, { code: 'ID', name: '印尼' },
  { code: 'TH', name: '泰国' }, { code: 'PH', name: '菲律宾' }, { code: 'VN', name: '越南' }, { code: 'NZ', name: '新西兰' },
  { code: 'IE', name: '爱尔兰' }, { code: 'AE', name: '阿联酋' }, { code: 'HK', name: '中国香港' }, { code: 'TW', name: '中国台湾' },
];

export function PointsCenter() {
  const [searchParams] = useSearchParams();
  const refCode = searchParams.get('ref')?.trim().toUpperCase() || '';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<PointsUser | null>(null);
  const [inviteCode, setInviteCode] = useState(refCode);
  const [bindStatus, setBindStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [copied, setCopied] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [regionStatus, setRegionStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');

  useEffect(() => {
    if (refCode) setInviteCode((c) => c || refCode);
  }, [refCode]);

  const loadUser = async () => {
    const data = await pointsAPI.me();
    setUser(data);
    setCountry(data.country ?? '');
    setCity(data.city ?? '');
  };

  const placeholderUser: PointsUser = {
    user_id: 'demo',
    invite_code: '------',
    points: 0,
    created_at: new Date().toISOString(),
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensurePointsUser();
        if (cancelled) return;
        const data = await pointsAPI.me();
        if (!cancelled) {
          setUser(data);
          setCountry(data.country ?? '');
          setCity(data.city ?? '');
        }
      } catch {
        if (!cancelled) {
          setDemoMode(true);
          setUser(placeholderUser);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleBind = async () => {
    if (!inviteCode.trim()) return;
    setBindStatus('loading');
    try {
      await pointsAPI.inviteBind(inviteCode.trim().toUpperCase());
      setBindStatus('ok');
      await loadUser();
    } catch {
      setBindStatus('err');
    }
  };

  const inviteLink = typeof window !== 'undefined' && user
    ? `${window.location.origin}/points?ref=${encodeURIComponent(user.invite_code)}`
    : '';

  const copyLink = () => {
    if (!inviteLink) return;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveRegion = async () => {
    setRegionStatus('loading');
    try {
      const updated = await pointsAPI.updateProfile({ country: country || undefined, city: city.trim() || undefined });
      setUser(updated);
      setRegionStatus('ok');
    } catch {
      setRegionStatus('err');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f0f13] text-gray-200 font-sans">
        <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-gray-800 z-50 flex items-center px-4">
          <Link to="/chunwan" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft size={20} /> 返回春晚
          </Link>
        </header>
        <div className="h-16" />
        <main className="flex-1 flex items-center justify-center p-6">
          <p className="text-gray-400">加载中…</p>
        </main>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f0f13] text-gray-200 font-sans">
        <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-gray-800 z-50 flex items-center px-4">
          <Link to="/chunwan" className="flex items-center gap-2 text-gray-400 hover:text-white">
            <ArrowLeft size={20} /> 返回春晚
          </Link>
        </header>
        <div className="h-16" />
        <main className="flex-1 flex items-center justify-center p-6">
          <p className="text-red-400">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f13] text-gray-200 font-sans">
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-gray-800 z-50 flex items-center justify-between px-4 md:px-6">
        <Link to="/chunwan" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">返回春晚</span>
        </Link>
        <span className="text-lg font-semibold text-white">积分中心</span>
        <div className="flex items-center gap-3 flex-wrap">
          <ConnectWalletButton onSuccess={() => loadUser()} />
          <PrivyLoginButton onSuccess={() => loadUser()} />
        </div>
      </header>

      <div className="h-16" />

      {demoMode && (
        <div className="max-w-lg mx-auto w-full px-4 pt-4">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-amber-200 text-sm">
            演示模式：积分与邀请功能需连接后端。本地开发请先运行 <code className="bg-black/30 px-1 rounded">npm run api</code> 或 <code className="bg-black/30 px-1 rounded">npm run dev:full</code>。
          </div>
        </div>
      )}

      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-8 space-y-8">
        <div className="rounded-xl bg-white/5 border border-gray-700/50 p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-500/20 flex items-center justify-center">
            <Coins className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm">当前积分</p>
            <p className="text-3xl font-bold text-white">{user?.points ?? 0}</p>
          </div>
        </div>

        <div className="rounded-xl bg-white/5 border border-gray-700/50 p-6 space-y-4">
          <h3 className="font-medium text-white flex items-center gap-2">
            <Globe size={18} /> 我的地区（参与全球福气地图）
          </h3>
          <p className="text-gray-400 text-sm">选择国家与城市，为所在地区贡献福气值，一起冲榜。</p>
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-gray-500 mb-1">国家</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={demoMode}
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white"
              >
                <option value="">请选择</option>
                {COUNTRY_OPTIONS.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="block text-xs text-gray-500 mb-1">城市</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={demoMode}
                placeholder="如：北京、新加坡市"
                className="w-full px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white placeholder-gray-500"
                maxLength={32}
              />
            </div>
            <button
              type="button"
              onClick={handleSaveRegion}
              disabled={demoMode || regionStatus === 'loading'}
              className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-50"
            >
              {regionStatus === 'loading' ? '保存中…' : regionStatus === 'ok' ? '已保存' : '保存'}
            </button>
          </div>
          {regionStatus === 'err' && <p className="text-sm text-red-400">保存失败，请稍后重试</p>}
          <Link to="/map" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm">
            <Globe size={14} /> 查看全球华人福气地图 →
          </Link>
        </div>

        <div className="rounded-xl bg-white/5 border border-gray-700/50 p-6 space-y-4">
          <h3 className="font-medium text-white flex items-center gap-2">
            <UserPlus size={18} /> 我的邀请码
          </h3>
          <p className="text-gray-400 text-sm">好友通过你的链接注册并绑定邀请码后，你可 +20 积分，对方 +10 积分。</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 px-3 py-2 rounded-lg bg-black/30 text-amber-400 font-mono">
              {user?.invite_code ?? '—'}
            </code>
            <button
              type="button"
              onClick={copyLink}
              className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 flex items-center gap-2 text-sm"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? '已复制' : '复制链接'}
            </button>
          </div>
          {inviteLink && (
            <p className="text-xs text-gray-500 break-all">{inviteLink}</p>
          )}
        </div>

        <div className="rounded-xl bg-white/5 border border-gray-700/50 p-6 space-y-4">
          <h3 className="font-medium text-white">绑定邀请码</h3>
          <p className="text-gray-400 text-sm">若你是通过好友链接来的，在此填写对方的邀请码领取积分。</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              placeholder="输入邀请码"
              className="flex-1 px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white placeholder-gray-500"
              maxLength={8}
            />
            <button
              type="button"
              onClick={handleBind}
              disabled={demoMode || bindStatus === 'loading' || !inviteCode.trim()}
              className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 disabled:opacity-50"
            >
              {bindStatus === 'loading' ? '提交中…' : bindStatus === 'ok' ? '已绑定' : '绑定'}
            </button>
          </div>
          {bindStatus === 'err' && <p className="text-sm text-red-400">邀请码无效或已绑定过邀请人</p>}
          {demoMode && <p className="text-xs text-gray-500">连接后端后可绑定邀请码。</p>}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
          >
            <Globe size={18} /> 全球福气地图
          </Link>
          <Link
            to="/predictions"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
          >
            去预测市场
          </Link>
        </div>
      </main>
    </div>
  );
}
