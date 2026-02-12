import React, { useState, useEffect, useMemo } from 'react';

type Language = 'zh' | 'en';

interface BibleVerse {
  id: number;
  verse: {
    zh: string;
    en: string;
  };
  reference: {
    zh: string;
    en: string;
  };
}

// 通用背景音乐 - 基督教轻音乐
const backgroundMusic = "https://www.youtube.com/embed/1EORb1WnGjk?autoplay=1&mute=0&loop=1&playlist=1EORb1WnGjk";

const bibleVerses: BibleVerse[] = [
  {
    id: 1,
    verse: {
      zh: "你要专心仰赖耶和华，不可倚靠自己的聪明，在你一切所行的事上都要认定他，他必指引你的路。",
      en: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight."
    },
    reference: { zh: "箴言 3:5-6", en: "Proverbs 3:5-6" }
  },
  {
    id: 2,
    verse: {
      zh: "你们要将一切的忧虑卸给神，因为他顾念你们。",
      en: "Cast all your anxiety on him because he cares for you."
    },
    reference: { zh: "彼得前书 5:7", en: "1 Peter 5:7" }
  },
  {
    id: 3,
    verse: {
      zh: "耶和华是我的牧者，我必不至缺乏。他使我躺卧在青草地上，领我在可安歇的水边。",
      en: "The LORD is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters."
    },
    reference: { zh: "诗篇 23:1-2", en: "Psalm 23:1-2" }
  },
  {
    id: 4,
    verse: {
      zh: "应当一无挂虑，只要凡事借着祷告、祈求，和感谢，将你们所要的告诉神。",
      en: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
    },
    reference: { zh: "腓立比书 4:6", en: "Philippians 4:6" }
  },
  {
    id: 5,
    verse: {
      zh: "因为神赐给我们，不是胆怯的心，乃是刚强、仁爱、谨守的心。",
      en: "For God has not given us a spirit of fear, but of power and of love and of a sound mind."
    },
    reference: { zh: "提摩太后书 1:7", en: "2 Timothy 1:7" }
  },
  {
    id: 6,
    verse: {
      zh: "爱是恒久忍耐，又有恩慈；爱是不嫉妒；爱是不自夸，不张狂。",
      en: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud."
    },
    reference: { zh: "哥林多前书 13:4", en: "1 Corinthians 13:4" }
  },
  {
    id: 7,
    verse: {
      zh: "不要为生命忧虑吃什么，为身体忧虑穿什么；因为生命胜于饮食，身体胜于衣裳。",
      en: "Therefore I tell you, do not worry about your life, what you will eat; or about your body, what you will wear. For life is more than food, and the body more than clothes."
    },
    reference: { zh: "路加福音 12:22-23", en: "Luke 12:22-23" }
  },
  {
    id: 8,
    verse: {
      zh: "我们晓得万事都互相效力，叫爱神的人得益处，就是按他旨意被召的人。",
      en: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose."
    },
    reference: { zh: "罗马书 8:28", en: "Romans 8:28" }
  },
  {
    id: 9,
    verse: {
      zh: "你们祈求，就给你们；寻找，就寻见；叩门，就给你们开门。",
      en: "Ask and it will be given to you; seek and you will find; knock and the door will be opened to you."
    },
    reference: { zh: "马太福音 7:7", en: "Matthew 7:7" }
  },
  {
    id: 10,
    verse: {
      zh: "人点灯，不放在斗底下，是放在灯台上，就照亮一家的人。",
      en: "Neither do people light a lamp and put it under a bowl. Instead they put it on its stand, and it gives light to everyone in the house."
    },
    reference: { zh: "马太福音 5:15", en: "Matthew 5:15" }
  }
];

const translations = {
  zh: {
    title: "📖 每日圣经",
    footer: "愿神的话语成为你每日的力量 🙏",
    refresh: "🔄 换一句",
    musicTitle: "背景音乐：奇异恩典"
  },
  en: {
    title: "📖 Daily Bible",
    footer: "May God's Word be your daily strength 🙏",
    refresh: "🔄 New Verse",
    musicTitle: "BGM: Amazing Grace"
  }
};

export const DailyBible: React.FC = () => {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
  const [language, setLanguage] = useState<Language>('zh');
  const [loading, setLoading] = useState(true);

  // 随机获取经文
  const getRandomVerse = () => {
    const randomIndex = Math.floor(Math.random() * bibleVerses.length);
    return bibleVerses[randomIndex];
  };

  useEffect(() => {
    // 检测浏览器语言
    const browserLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    setLanguage(browserLang);

    // 随机显示一条经文
    setCurrentVerse(getRandomVerse());
    setLoading(false);
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  const refreshVerse = () => {
    setCurrentVerse(getRandomVerse());
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
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-wide">
          {t.title}
        </h1>

        {/* 经文卡片 */}
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl mb-8">
          <p className="text-white text-xl md:text-2xl leading-relaxed mb-6 font-light">
            {currentVerse.verse[language]}
          </p>
          <p className="text-yellow-300 text-lg md:text-xl font-medium">
            —— {currentVerse.reference[language]}
          </p>
        </div>

        {/* 换一句按钮 */}
        <button
          onClick={refreshVerse}
          className="mb-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm transition-colors border border-white/20"
        >
          {t.refresh}
        </button>

        {/* 音乐播放器 - 固定背景音乐 */}
        <div className="bg-black/30 rounded-2xl overflow-hidden border border-white/10">
          <div className="p-3 bg-white/5 border-b border-white/10">
            <p className="text-white/60 text-xs">{t.musicTitle}</p>
          </div>
          <div className="h-16">
            <iframe
              width="100%"
              height="100%"
              src={backgroundMusic}
              title="Background Music"
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
