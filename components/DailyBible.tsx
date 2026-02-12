import React, { useState, useEffect } from 'react';

interface BibleVerse {
  date: string;
  verse: string;
  reference: string;
  musicUrl: string;
  musicTitle: string;
}

const bibleVerses: BibleVerse[] = [
  {
    date: "2026-02-12",
    verse: "你要专心仰赖耶和华，不可倚靠自己的聪明，在你一切所行的事上都要认定他，他必指引你的路。",
    reference: "箴言 3:5-6",
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk", // lofi 音乐示例
    musicTitle: "Peaceful Lofi - 安静时刻"
  },
  {
    date: "2026-02-11",
    verse: "应当一无挂虑，只要凡事借着祷告、祈求，和感谢，将你们所要的告诉神。神所赐、出人意外的平安必在基督耶稣里保守你们的心怀意念。",
    reference: "腓立比书 4:6-7",
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    musicTitle: "Gospel Piano - 福音钢琴"
  },
  {
    date: "2026-02-10",
    verse: "因为神赐给我们，不是胆怯的心，乃是刚强、仁爱、谨守的心。",
    reference: "提摩太后书 1:7",
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    musicTitle: "Worship Music - 敬拜音乐"
  },
  {
    date: "2026-02-13",
    verse: "你们要将一切的忧虑卸给神，因为他顾念你们。",
    reference: "彼得前书 5:7",
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    musicTitle: "Peaceful Worship - 平安敬拜"
  },
  {
    date: "2026-02-14",
    verse: "耶和华是我的牧者，我必不至缺乏。他使我躺卧在青草地上，领我在可安歇的水边。",
    reference: "诗篇 23:1-2",
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk",
    musicTitle: "Shepherd's Song - 牧者之歌"
  }
];

export const DailyBible: React.FC = () => {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // 获取今天的日期
    const today = new Date().toISOString().split('T')[0];
    
    // 查找今天的经文，如果没有就随机显示
    const todayVerse = bibleVerses.find(v => v.date === today);
    if (todayVerse) {
      setCurrentVerse(todayVerse);
    } else {
      // 随机显示一条
      const randomIndex = Math.floor(Math.random() * bibleVerses.length);
      setCurrentVerse(bibleVerses[randomIndex]);
    }
  }, []);

  if (!currentVerse) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* 主卡片 */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
          {/* 标题 */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">📖 每日圣经</h1>
            <p className="text-white/60 text-sm">{currentVerse.date}</p>
          </div>

          {/* 经文 */}
          <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-white/10">
            <p className="text-white text-lg leading-relaxed text-center mb-4">
              "{currentVerse.verse}"
            </p>
            <p className="text-yellow-300 text-center font-medium">
              —— {currentVerse.reference}
            </p>
          </div>

          {/* 音乐 */}
          <div className="mb-6">
            <h3 className="text-white/80 text-sm mb-3 flex items-center gap-2">
              🎵 {currentVerse.musicTitle}
            </h3>
            <div className="aspect-video rounded-xl overflow-hidden bg-black/30">
              <iframe
                width="100%"
                height="100%"
                src={currentVerse.musicUrl}
                title="Music"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* 按钮 */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm transition-colors"
            >
              {showHistory ? '隐藏历史' : '查看历史'}
            </button>
            <button
              onClick={() => {
                const randomIndex = Math.floor(Math.random() * bibleVerses.length);
                setCurrentVerse(bibleVerses[randomIndex]);
              }}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-lg text-sm transition-colors"
            >
              🎲 随机经文
            </button>
          </div>
        </div>

        {/* 历史记录 */}
        {showHistory && (
          <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-bold mb-4">📚 历史经文</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {bibleVerses.map((verse, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentVerse(verse)}
                  className="w-full text-left p-3 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <p className="text-white/80 text-sm truncate">{verse.verse.slice(0, 50)}...</p>
                  <p className="text-yellow-300/80 text-xs mt-1">{verse.reference} · {verse.date}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 底部提示 */}
        <p className="text-center text-white/40 text-xs mt-6">
          愿神的话语成为你每日的力量 ⚡️
        </p>
      </div>
    </div>
  );
};
