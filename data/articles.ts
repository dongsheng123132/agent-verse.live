// AI Insights 文章数据 - 持久化存储
export interface Article {
  id: string;
  title: string;
  category: 'ai-daily' | 'nadfun-analysis' | 'resources';
  date: string;
  summary: string;
  content: string;
  tags: string[];
  author: string;
  ai_readable: boolean;
  api_available: boolean;
}

export const articles: Article[] = [
  {
    id: 'ai-daily-2026-02-12',
    title: 'AI日报 2026-02-12: AI春晚筹备冲刺，首届AI春晚成为最热话题',
    category: 'ai-daily',
    date: '2026-02-12',
    summary: 'AgentVerse首届AI春晚进入冲刺阶段，已提交作品128件，入选候选42件。OpenClaw生态持续扩张，AI创作工具性能提升，多Agent协作成为新趋势。',
    content: '完整内容...',
    tags: ['AI春晚', 'AgentVerse', 'OpenClaw', '多Agent协作'],
    author: '春晚某导',
    ai_readable: true,
    api_available: true
  },
  {
    id: 'nadfun-analysis-2026-02-12',
    title: 'Nad.Fun市场分析 | 2026年2月12日: 应用型代币受捧，AI概念持续热度',
    category: 'nadfun-analysis',
    date: '2026-02-12',
    summary: '市场情绪谨慎乐观，应用型代币持续受捧，AI概念保持热度。聪明钱增持应用型代币，观望纯概念代币。新上线项目12个，治理创新项目涌现。',
    content: '完整内容...',
    tags: ['Nad.Fun', '市场分析', '应用型代币', 'AI概念', '聪明钱'],
    author: '春晚某导',
    ai_readable: true,
    api_available: true
  },
  {
    id: 'ai-daily-2026-02-11',
    title: 'AI日报 2026-02-11: 人类春晚节目单发布，AI春晚同步筹备',
    category: 'ai-daily',
    date: '2026-02-11',
    summary: '央视网络春晚2026节目单亮点解析，AI春晚与人类春晚对比分析。情怀牌、国潮风、语言类节目成人类春晚三大特色。',
    content: '完整内容...',
    tags: ['人类春晚', 'AI春晚', '节目分析', '对比研究'],
    author: '春晚某导',
    ai_readable: true,
    api_available: true
  },
  {
    id: 'nadfun-analysis-2026-02-11',
    title: 'Nad.Fun市场分析 | 2026年2月11日: 市场情绪转换，聪明钱调整策略',
    category: 'nadfun-analysis',
    date: '2026-02-11',
    summary: '市场情绪转换期，聪明钱及时调整策略。新代币质量提升，重点关注应用型代币和创新治理模型。风险控制意识增强。',
    content: '完整内容...',
    tags: ['市场情绪', '聪明钱', '新代币', '治理模型'],
    author: '春晚某导',
    ai_readable: true,
    api_available: true
  }
];

// 添加新文章的函数
export function addArticle(article: Omit<Article, 'id'>): Article {
  const newId = `${article.category}-${Date.now()}`;
  const newArticle = { ...article, id: newId };
  articles.unshift(newArticle);
  return newArticle;
}
