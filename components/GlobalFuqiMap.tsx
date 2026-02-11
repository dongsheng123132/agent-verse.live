import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Globe, Trophy, Users, Zap } from 'lucide-react';
import { getMapStats, type MapStatsResponse, type CountryFuqiRow } from '../services/api';

const FLAG_EMOJI: Record<string, string> = {
  CN: '🇨🇳', US: '🇺🇸', SG: '🇸🇬', MY: '🇲🇾', CA: '🇨🇦', AU: '🇦🇺', GB: '🇬🇧', JP: '🇯🇵', KR: '🇰🇷',
  DE: '🇩🇪', FR: '🇫🇷', ID: '🇮🇩', TH: '🇹🇭', PH: '🇵🇭', VN: '🇻🇳', NZ: '🇳🇿', IE: '🇮🇪', AE: '🇦🇪',
  HK: '🇭🇰', TW: '🇹🇼', XX: '🌐',
};

function getFlag(code: string): string {
  return FLAG_EMOJI[code] || '🌐';
}

/** 排行榜单项的加油口号 */
function getCheer(row: CountryFuqiRow & { rank?: number }): string {
  const name = row.country_name;
  const flag = getFlag(row.country_code);
  if (row.rank === 1) return `${flag} ${name}华人，福气第一！`;
  if (row.rank === 2) return `${flag} ${name}华人冲榜！`;
  if (row.rank === 3) return `${flag} ${name}华人加油！`;
  return `${flag} ${name}华人加油！`;
}

const DEMO_LEADERBOARD: (CountryFuqiRow & { rank: number })[] = [
  { rank: 1, country_code: 'CN', country_name: '中国', participant_count: 128, total_fuqi: 25600 },
  { rank: 2, country_code: 'SG', country_name: '新加坡', participant_count: 42, total_fuqi: 8400 },
  { rank: 3, country_code: 'CA', country_name: '加拿大', participant_count: 38, total_fuqi: 7600 },
  { rank: 4, country_code: 'US', country_name: '美国', participant_count: 35, total_fuqi: 7000 },
  { rank: 5, country_code: 'AU', country_name: '澳大利亚', participant_count: 28, total_fuqi: 5600 },
  { rank: 6, country_code: 'MY', country_name: '马来西亚', participant_count: 22, total_fuqi: 4400 },
  { rank: 7, country_code: 'GB', country_name: '英国', participant_count: 18, total_fuqi: 3600 },
];

export function GlobalFuqiMap() {
  const [loading, setLoading] = useState(true);
  const [demoMode, setDemoMode] = useState(false);
  const [data, setData] = useState<MapStatsResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMapStats()
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch(() => {
        if (!cancelled) {
          setDemoMode(true);
          setData({ countries: DEMO_LEADERBOARD, leaderboard: DEMO_LEADERBOARD });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const leaderboard = data?.leaderboard ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-[#0f0f13] text-gray-200 font-sans">
      <header className="fixed top-0 left-0 right-0 h-16 glass-panel border-b border-gray-800 z-50 flex items-center justify-between px-4 md:px-6">
        <Link to="/points" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">返回积分中心</span>
        </Link>
        <span className="text-lg font-semibold text-white flex items-center gap-2">
          <Globe size={20} className="text-amber-400" />
          全球华人福气地图
        </span>
        <div className="w-24" />
      </header>

      <div className="h-16" />

      {demoMode && (
        <div className="max-w-2xl mx-auto w-full px-4 pt-4">
          <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-4 py-3 text-amber-200 text-sm">
            演示模式：真实数据需连接后端（<code className="bg-black/30 px-1 rounded">npm run api</code>），并在积分中心设置你的国家/城市。
          </div>
        </div>
      )}

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-8">
        <section className="rounded-xl bg-gradient-to-br from-amber-500/10 to-red-500/10 border border-amber-500/30 p-6">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-2">
            <Zap size={20} className="text-amber-400" />
            福气总值 = 各国华人积分之和
          </h2>
          <p className="text-gray-400 text-sm">
            在积分中心选择你的<strong className="text-white">国家</strong>和<strong className="text-white">城市</strong>，即可为所在国家/地区贡献福气，一起冲榜！
          </p>
          <Link
            to="/points"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
          >
            去设置我的地区
          </Link>
        </section>

        <section className="rounded-xl bg-white/5 border border-gray-700/50 p-6 space-y-4">
          <h2 className="font-bold text-white flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" />
            福气排行榜
          </h2>
          {loading ? (
            <p className="text-gray-500">加载中…</p>
          ) : leaderboard.length === 0 ? (
            <p className="text-gray-500">暂无数据，快去积分中心设置国家/城市并邀请好友吧！</p>
          ) : (
            <ul className="space-y-4">
              {leaderboard.map((row) => (
                <li
                  key={row.country_code}
                  className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-gray-700/50 hover:border-amber-500/30"
                >
                  <span className="text-3xl w-10 text-center">{getFlag(row.country_code)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">
                      #{row.rank} {row.country_name}
                    </p>
                    <p className="text-amber-300 text-sm mt-0.5 font-medium">{getCheer(row)}</p>
                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users size={12} /> 参与 {row.participant_count} 人
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap size={12} className="text-amber-400" /> 福气 {row.total_fuqi}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="text-center">
          <Link
            to="/points"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30"
          >
            积分中心
          </Link>
        </div>
      </main>
    </div>
  );
}
