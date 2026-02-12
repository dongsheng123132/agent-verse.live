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
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0",
    musicTitle: "安静时刻 - Lofi"
  },
  {
    date: "2026-02-13",
    verse: "你们要将一切的忧虑卸给神，因为他顾念你们。",
    reference: "彼得前书 5:7",
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0",
    musicTitle: "平安敬拜"
  },
  {
    date: "2026-02-14",
    verse: "耶和华是我的牧者，我必不至缺乏。他使我躺卧在青草地上，领我在可安歇的水边。",
    reference: "诗篇 23:1-2",
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0",
    musicTitle: "牧者之歌"
  },
  {
    date: "2026-02-15",
    verse: "应当一无挂虑，只要凡事借着祷告、祈求，和感谢，将你们所要的告诉神。",
    reference: "腓立比书 4:6",
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0",
    musicTitle: "福音钢琴"
  },
  {
    date: "2026-02-16",
    verse: "因为神赐给我们，不是胆怯的心，乃是刚强、仁爱、谨守的心。",
    reference: "提摩太后书 1:7",
    musicUrl: "https://www.youtube.com/embed/jfKfPfyJRdk?autoplay=1&mute=0",
    musicTitle: "敬拜音乐"
  }
];

export const DailyBible: React.FC = () => {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 获取今天的日期
    const today = new Date().toISOString().split('T')[0];
    
    // 查找今天的经文
    const todayVerse = bibleVerses.find(v => v.date === today);
    
    if (todayVerse) {
      setCurrentVerse(todayVerse);
    } else {
      // 如果没有今天的，显示第一条
      setCurrentVerse(bibleVerses[0]);
    }
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">加载中...</div>
      </div>
    );
  }

  if (!currentVerse) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-6">
      {/* 主内容区 */}
      <div className="max-w-3xl w-full text-center">
        
        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-wide">
          📖 每日圣经
        </h1>
        <p className="text-white/50 mb-10">{currentVerse.date}</p>

        {/* 经文卡片 */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-8">
          <p className="text-white text-xl md:text-2xl leading-relaxed mb-6 font-light">
            {currentVerse.verse}
          </p>
          <p className="text-yellow-300 text-lg md:text-xl font-medium">
            —— {currentVerse.reference}
          </p>
        </div>

        {/* 音乐播放器 */}
        <div className="bg-black/30 rounded-2xl overflow-hidden border border-white/10">
          <div className="p-4 bg-white/5 border-b border-white/10">
            <p className="text-white/80 text-sm">🎵 {currentVerse.musicTitle}</p>
          </div>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={currentVerse.musicUrl}
              title={currentVerse.musicTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* 底部祝福 */}
        <p className="text-white/40 text-sm mt-8">
          愿神的话语成为你每日的力量 🙏
        </p>
      </div>
    </div>
  );
};
