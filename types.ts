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
  GALA = 'GALA'
}