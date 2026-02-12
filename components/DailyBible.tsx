import React, { useState, useEffect } from 'react';

type Language = 'zh' | 'en';

interface BibleVerse {
  date: string;
  verse: {
    zh: string;
    en: string;
  };
  reference: {
    zh: string;
    en: string;
  };
  musicUrl: string;
  musicTitle: {
    zh: string;
    en: string;
  };
}

const bibleVerses: BibleVerse[] = [
  {
    date: "2026-02-12",
    verse: {
      zh: "你要专心仰赖耶和华，不可倚靠自己的聪明，在你一切所行的事上都要认定他，他必指引你的路。",
      en: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."
    },
    reference: {
      zh: "箴言 3:5-6",
      en: "Proverbs 3:5-6"
    },
    musicUrl: "https://www.youtube.com/embed/1EORb1WnGjk?autoplay=1",
    musicTitle: {
      zh: "奇异恩典 - 经典圣诗",
      en: "Amazing Grace - Classic Hymn"
    }
  },
  {
    date: "2026-02-13",
    verse: {
      zh: "你们要将一切的忧虑卸给神，因为他顾念你们。",
      en: "Cast all your anxiety on him because he cares for you."
    },
    reference: {
      zh: "彼得前书 5:7",
      en: "1 Peter 5:7"
    },
    musicUrl: "https://www.youtube.com/embed/8Z3Q3Jd3e0o?autoplay=1",
    musicTitle: {
      zh: "你信实何广大 - 圣诗",
      en: "Great Is Thy Faithfulness"
    }
  },
  {
    date: "2026-02-14",
    verse: {
      zh: "耶和华是我的牧者，我必不至缺乏。他使我躺卧在青草地上，领我在可安歇的水边。",
      en: "The LORD is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters."
    },
    reference: {
      zh: "诗篇 23:1-2",
      en: "Psalm 23:1-2"
    },
    musicUrl: "https://www.youtube.com/embed/mIgS5p9O2Xw?autoplay=1",
    musicTitle: {
      zh: "主是我力量 - 敬拜诗歌",
      en: "The Lord Is My Strength"
    }
  },
  {
    date: "2026-02-15",
    verse: {
      zh: "应当一无挂虑，只要凡事借着祷告、祈求，和感谢，将你们所要的告诉神。",
      en: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
    },
    reference: {
      zh: "腓立比书 4:6",
      en: "Philippians 4:6"
    },
    musicUrl: "https://www.youtube.com/embed/6vG8M0X5z0Y?autoplay=1",
    musicTitle: {
      zh: "赞美之泉 - 敬拜音乐",
      en: "River of Praise"
    }
  },
  {
    date: "2026-02-16",
    verse: {
      zh: "因为神赐给我们，不是胆怯的心，乃是刚强、仁爱、谨守的心。",
      en: "For God has not given us a spirit of fear, but of power and of love and of a sound mind."
    },
    reference: {
      zh: "提摩太后书 1:7",
      en: "2 Timothy 1:7"
    },
    musicUrl: "https://www.youtube.com/embed/2b4f7v0X3zQ?autoplay=1",
    musicTitle: {
      zh: "刚强仁爱谨守的心 - 福音诗歌",
      en: "Spirit of Power, Love & Sound Mind"
    }
  }
];

const translations = {
  zh: {
    title: "📖 每日圣经",
    footer: "愿神的话语成为你每日的力量 🙏",
    music: "🎵",
    date: "日期"
  },
  en: {
    title: "📖 Daily Bible",
    footer: "May God's Word be your daily strength 🙏",
    music: "🎵",
    date: "Date"
  }
};

export const DailyBible: React.FC = () => {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
  const [language, setLanguage] = useState<Language>('zh');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 检测浏览器语言
    const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    setLanguage(browserLang);

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

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!currentVerse) return null;

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex flex-col items-center justify-center p-6">
      {/* 语言切换按钮 */}
      <button
        onClick={toggleLanguage}
        className="fixed top-6 right-6 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white text-sm border border-white/20 transition-colors"
      >
        {language === 'zh' ? '🇨🇳 中文' : '🇺🇸 English'}
      </button>

      {/* 主内容区 */}
      <div className="max-w-3xl w-full text-center">
        
        {/* 标题 */}
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 tracking-wide">
          {t.title}
        </h1>
        <p className="text-white/50 mb-10">{currentVerse.date}</p>

        {/* 经文卡片 */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-8">
          <p className="text-white text-xl md:text-2xl leading-relaxed mb-6 font-light">
            {currentVerse.verse[language]}
          </p>
          <p className="text-yellow-300 text-lg md:text-xl font-medium">
            —— {currentVerse.reference[language]}
          </p>
        </div>

        {/* 音乐播放器 */}
        <div className="bg-black/30 rounded-2xl overflow-hidden border border-white/10">
          <div className="p-4 bg-white/5 border-b border-white/10">
            <p className="text-white/80 text-sm">
              {t.music} {currentVerse.musicTitle[language]}
            </p>
          </div>
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={currentVerse.musicUrl}
              title={currentVerse.musicTitle[language]}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* 底部祝福 */}
        <p className="text-white/40 text-sm mt-8">
          {t.footer}
        </p>
      </div>
    </div>
  );
};
