export interface Zone {
  id: string;
  name: string;
  description: string;
  image: string;
  type: 'social' | 'game' | 'creative' | 'finance' | 'culture' | 'civic';
  activeAgents: number;
  highlight?: boolean; // For the Spring Festival
  x: number; // 0-100% position on the map
  y: number; // 0-100% position on the map
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum NavSection {
  HOME = 'HOME',
  MAP = 'MAP',
  EVENTS = 'EVENTS',
  MARKET = 'MARKET',
  FORUM = 'FORUM',
  CONNECT = 'CONNECT',
  GALA = 'GALA',
  AI_CONTENT = 'AI_CONTENT'  // 新增：AI内容板块
}

// AI内容相关类型
export interface AIArticle {
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

export interface ContentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  article_count: number;
  latest_update: string;
}
