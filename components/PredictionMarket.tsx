import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Coins, Scale } from 'lucide-react';
import {
  pointsAPI,
  predictionsAPI,
  ensurePointsUser,
  type PredictionTopic,
  type MyStake,
} from '../services/api';

const SINGLE_TOPIC_PLACEHOLDER: PredictionTopic = {
  topic_id: 't1',
  title: '2026 春晚观看人数能不能破 10 亿？',
  total_pool: 0,
  options: [
    { id: 'yes', label: '是', total_shares: 0, probability: 0.5 },
    { id: 'no', label: '否', total_shares: 0, probability: 0.5 },
  ],
  settled_at: null,
  result_option_id: null,
  resolution_criteria: '以微博或权威机构公布的观看/播放数据为准，可验证。',
};

export function PredictionMarket() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [topic, setTopic] = useState<PredictionTopic | null>(null);
  const [myStakes, setMyStakes] = useState<MyStake[]>([]);
  const [points, setPoints] = useState<number | null>(null);
  const [stakeOption, setStakeOption] = useState('');
  const [stakePoints, setStakePoints] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle');
  const [demoMode, setDemoMode] = useState(false);
  // 演示模式下的本地份额与概率（不连后端时也能“买入”看效果）
  const [demoPoints, setDemoPoints] = useState(100);
  const [demoTopic, setDemoTopic] = useState<PredictionTopic>(SINGLE_TOPIC_PLACEHOLDER);
  const [demoMyStakes, setDemoMyStakes] = useState<MyStake[]>([]);

  const loadData = async () => {
    const [topicsData, stakesData, meData] = await Promise.all([
      predictionsAPI.topics(),
      predictionsAPI.myStakes(),
      pointsAPI.me(),
    ]);
    // 只认「观看人数破 10 亿」的是/否题，其它旧题一律不展示
    const list = Array.isArray(topicsData) ? topicsData : [];
    const binaryTopic = list.find(
      (t) => t.options?.length === 2 && t.options.some((o) => o.id === 'yes') && t.options.some((o) => o.id === 'no')
    );
    setTopic(binaryTopic ?? SINGLE_TOPIC_PLACEHOLDER);
    setMyStakes(stakesData);
    setPoints(meData.points);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await ensurePointsUser();
        if (cancelled) return;
        await loadData();
      } catch {
        if (!cancelled) {
          setDemoMode(true);
          setTopic(SINGLE_TOPIC_PLACEHOLDER);
          setMyStakes([]);
          setPoints(0);
          setError(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const handleStake = async () => {
    if (!topic || !stakeOption || !stakePoints.trim()) return;
    const p = Math.floor(Number(stakePoints));
    if (p <= 0) return;
    const currentPoints = demoMode ? demoPoints : (points ?? 0);
    if (currentPoints < p) {
      setSubmitStatus('err');
      return;
    }
    if (demoMode) {
      const label = topic.options.find((x) => x.id === stakeOption)?.label ?? stakeOption;
      setDemoPoints((prev) => prev - p);
      setDemoMyStakes((prev) => {
        const existing = prev.find((s) => s.option_id === stakeOption);
        if (existing) {
          return prev.map((s) => (s.option_id === stakeOption ? { ...s, points_staked: s.points_staked + p } : s));
        }
        return [...prev, { topic_id: topic.topic_id, title: topic.title, option_id: stakeOption, option_label: label, points_staked: p, created_at: new Date().toISOString(), settled: false }];
      });
      setDemoTopic((prev) => {
        const yesShares = (prev.options[0].id === 'yes' ? (prev.options[0].total_shares ?? 0) : (prev.options[1].total_shares ?? 0)) + (stakeOption === 'yes' ? p : 0);
        const noShares = (prev.options[0].id === 'no' ? (prev.options[0].total_shares ?? 0) : (prev.options[1].total_shares ?? 0)) + (stakeOption === 'no' ? p : 0);
        const total = yesShares + noShares;
        const yesP = total > 0 ? yesShares / total : 0.5;
        const noP = total > 0 ? noShares / total : 0.5;
        const opt0 = prev.options[0];
        const opt1 = prev.options[1];
        return {
          ...prev,
          total_pool: total,
          options: [
            { ...opt0, total_shares: opt0.id === 'yes' ? yesShares : noShares, probability: opt0.id === 'yes' ? yesP : noP },
            { ...opt1, total_shares: opt1.id === 'yes' ? yesShares : noShares, probability: opt1.id === 'yes' ? yesP : noP },
          ],
        };
      });
      setSubmitStatus('ok');
      setStakeOption('');
      setStakePoints('');
      return;
    }
    setSubmitStatus('loading');
    try {
      await predictionsAPI.stake(topic.topic_id, stakeOption, p);
      setSubmitStatus('ok');
      setStakeOption('');
      setStakePoints('');
      await loadData();
    } catch {
      setSubmitStatus('err');
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

  if (error && !topic) {
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

  const t = demoMode ? demoTopic : topic!;
  const opts = t.options as { id: string; label: string; total_shares?: number; probability?: number }[];
  const totalPool = t.total_pool ?? 0;
  const displayPoints = demoMode ? demoPoints : (points ?? 0);
  const displayStakes = demoMode ? demoMyStakes : myStakes;
  const canBuy = !t.settled_at && displayPoints >= 1;

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f13] text-gray-200 font-sans">
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-gray-800 z-50 flex items-center justify-between px-4 md:px-6">
        <Link to="/chunwan" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">返回春晚</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link to="/points" className="flex items-center gap-2 text-amber-400 text-sm">
            <Coins size={16} /> {displayPoints} 积分{demoMode && '（演示）'}
          </Link>
          <span className="text-lg font-semibold text-white">预测</span>
        </div>
        <div className="w-24" />
      </header>

      <div className="h-16" />

      {demoMode && (
        <div className="max-w-xl mx-auto w-full px-4 pt-4">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-amber-200 text-sm">
            演示模式：可用虚拟积分体验买入，概率会随买入变化。真实数据需运行 <code className="bg-black/30 px-1 rounded">npm run api</code> 后刷新。
          </div>
        </div>
      )}

      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 space-y-6">
        <section className="text-center">
          <h1 className="text-lg font-bold text-white">2026 春晚 · 预测</h1>
          <p className="text-gray-500 text-xs mt-1">观看人数能否破 10 亿 · 是/否 · 以微博/权威数据可验证</p>
        </section>

        <section className="rounded-xl bg-white/5 border border-gray-700/50 overflow-hidden">
          <div className="p-4 border-b border-gray-700/50">
            <p className="font-medium text-white">{t.title}</p>
            {t.resolution_criteria && (
              <p className="text-gray-500 text-xs mt-2 flex items-start gap-2">
                <Scale size={14} className="shrink-0 mt-0.5" />
                <span>结算依据：{t.resolution_criteria}</span>
              </p>
            )}
            {totalPool > 0 && <p className="text-gray-500 text-xs mt-1">总池 {totalPool} 份额</p>}
            {t.settled_at && (
              <span className="inline-block mt-2 px-2 py-0.5 rounded text-xs bg-gray-700/50 text-gray-400">已结算</span>
            )}
          </div>
          <div className="p-4">
            {!t.settled_at && (
              <>
                <p className="text-gray-500 text-xs mb-3">点击「是」或「否」后，在下方输入份额数并点「买入」即可。</p>
                <div className="grid grid-cols-2 gap-3">
                {opts.map((o) => {
                  const pct = o.probability != null ? Math.round(o.probability * 100) : 50;
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setStakeOption(o.id)}
                      className={`flex flex-col rounded-lg border p-4 text-left transition-colors ${
                        stakeOption === o.id
                          ? 'bg-amber-500/20 border-amber-500/50'
                          : 'bg-black/20 border-gray-700 hover:border-amber-500/30'
                      }`}
                    >
                      <span className="font-medium text-white">{o.label}</span>
                      <div className="mt-2 h-2 rounded-full bg-gray-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-amber-500/70"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-amber-400 tabular-nums mt-1">{pct}%</span>
                    </button>
                  );
                })}
                </div>
              </>
            )}
          </div>
        </section>

        {stakeOption && !t.settled_at && (
          <section className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-3">
            <h3 className="font-medium text-amber-200">买份额</h3>
            <p className="text-xs text-gray-400 mb-1">买法：选「是」或「否」→ 输入份额数 → 点「买入」；扣积分、该选项概率上升。</p>
            <p className="text-white font-medium">{opts.find((x) => x.id === stakeOption)?.label}</p>
            {!canBuy && !demoMode && (
              <p className="text-amber-200/90 text-sm">积分不足，请先到 <Link to="/points" className="underline">积分中心</Link> 领取积分后再买。</p>
            )}
            <div className="flex flex-wrap gap-3 items-center">
              <input
                type="number"
                min={1}
                max={displayPoints}
                value={stakePoints}
                onChange={(e) => setStakePoints(e.target.value)}
                placeholder="份额"
                className="w-24 px-3 py-2 rounded-lg bg-black/30 border border-gray-600 text-white text-center"
              />
              <span className="text-gray-400 text-sm">份额（1 积分 = 1 份额）</span>
              <button
                type="button"
                onClick={handleStake}
                disabled={submitStatus === 'loading' || !stakePoints.trim() || !canBuy}
                className="px-5 py-2 rounded-lg bg-amber-500/25 text-amber-200 border border-amber-500/40 hover:bg-amber-500/35 disabled:opacity-50 font-medium"
              >
                {submitStatus === 'loading' ? '提交中…' : submitStatus === 'ok' ? '已买入' : '买入'}
              </button>
              <button
                type="button"
                onClick={() => { setStakeOption(''); setStakePoints(''); setSubmitStatus('idle'); }}
                className="text-gray-400 hover:text-white text-sm"
              >
                取消
              </button>
            </div>
            {submitStatus === 'err' && <p className="text-sm text-red-400">买入失败（积分不足）</p>}
          </section>
        )}

        <section className="rounded-xl bg-white/5 border border-gray-700/50 p-4 space-y-3">
          <h3 className="font-medium text-white">我的份额</h3>
          {displayStakes.length === 0 ? (
            <p className="text-gray-500 text-sm">暂无份额，选「是」或「否」买入即可参与。</p>
          ) : (
            <ul className="space-y-2">
              {displayStakes.map((s, i) => (
                <li key={i} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-0 text-sm">
                  <span className="text-gray-300">
                    {s.title} → <span className="text-white">{s.option_label}</span>（{s.points_staked} 份额）
                  </span>
                  {s.settled && (
                    <span className={s.won ? 'text-green-400 font-medium' : 'text-red-400 font-medium'}>
                      {s.won ? '赢' : '输'}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-wrap justify-center gap-4 pt-2">
          <Link
            to="/points"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
          >
            <Coins size={18} /> 积分中心
          </Link>
          <Link
            to="/chunwan"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 text-gray-300 border border-gray-600 hover:bg-white/10"
          >
            返回春晚
          </Link>
        </div>
      </main>
    </div>
  );
}
