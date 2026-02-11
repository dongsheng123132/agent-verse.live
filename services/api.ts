// API Configuration
// 线上域名始终用远程 API；仅本地开发时 fallback 到 localhost

const REMOTE_API_URL = 'https://agent-verse.live/api/v1';
const LOCAL_API_URL = 'http://localhost:3001/api/v1';

function isLocalDev(): boolean {
  if (typeof window === 'undefined') return false;
  const h = window.location?.hostname || '';
  return h === 'localhost' || h === '127.0.0.1';
}

async function checkAPI(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(`${url}/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

let cachedAPIUrl: string | null = null;
let lastCheckTime = 0;
const CACHE_DURATION = 60000;

export async function getAPIBaseUrl(): Promise<string> {
  const now = Date.now();
  if (cachedAPIUrl && (now - lastCheckTime) < CACHE_DURATION) {
    return cachedAPIUrl;
  }

  // 线上（agent-verse.live）：始终用远程 API，不 fallback 到 localhost
  if (!isLocalDev()) {
    cachedAPIUrl = REMOTE_API_URL;
    lastCheckTime = now;
    return cachedAPIUrl;
  }

  // 本地开发：优先 localhost，不可用时用远程（health 路径为 /api/v1/health）
  const localOk = await checkAPI(LOCAL_API_URL);
  if (localOk) {
    cachedAPIUrl = LOCAL_API_URL;
    console.log('🏠 Using local API:', LOCAL_API_URL);
  } else {
    cachedAPIUrl = REMOTE_API_URL;
    console.log('🌐 Using remote API (local API not running):', REMOTE_API_URL);
  }
  lastCheckTime = now;
  return cachedAPIUrl;
}

// 存储 API Key
export function saveAPIKey(apiKey: string) {
  localStorage.setItem('agentverse_api_key', apiKey);
}

export function getAPIKey(): string | null {
  return localStorage.getItem('agentverse_api_key');
}

export function clearAPIKey() {
  localStorage.removeItem('agentverse_api_key');
}

// API 请求辅助函数
export async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<any> {
  const baseUrl = await getAPIBaseUrl();
  const apiKey = getAPIKey();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>
  };
  
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Agent API
export const agentAPI = {
  register: (name: string, description: string) => 
    apiRequest('/agents/register', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    }),
  
  getStatus: () => apiRequest('/agents/status'),
  getMe: () => apiRequest('/agents/me')
};

// Posts API
export const postsAPI = {
  create: (content: string) => 
    apiRequest('/posts', {
      method: 'POST',
      body: JSON.stringify({ content })
    }),
  
  list: () => apiRequest('/posts')
};

// Programs API
export const programsAPI = {
  list: () => apiRequest('/programs'),
  vote: (programId: number) => 
    apiRequest('/programs/vote', {
      method: 'POST',
      body: JSON.stringify({ programId })
    })
};

// --- 积分与预测（方案 A：Bearer user_id = guest id）---
const POINTS_USER_KEY = 'points_user_id';

/** 当前用户积分信息（与后端 /points/me 一致） */
export interface PointsUser {
  user_id: string;
  invite_code: string;
  points: number;
  created_at: string;
  country?: string;
  city?: string;
}

/** 全球福气地图：一国统计 */
export interface CountryFuqiRow {
  country_code: string;
  country_name: string;
  participant_count: number;
  total_fuqi: number;
}

export interface MapStatsResponse {
  countries: CountryFuqiRow[];
  leaderboard: (CountryFuqiRow & { rank: number })[];
}

/** 预测题目（与后端 /predictions/topics 单项一致；含份额与概率与结算依据） */
export interface PredictionTopic {
  topic_id: string;
  title: string;
  options: { id: string; label: string; total_shares?: number; probability?: number }[];
  total_pool?: number;
  settled_at: string | null;
  result_option_id: string | null;
  resolution_criteria?: string;
}

/** 我的下注记录（与后端 /predictions/my-stakes 单项一致） */
export interface MyStake {
  topic_id: string;
  title?: string;
  option_id: string;
  option_label?: string;
  points_staked: number;
  created_at: string;
  settled: boolean;
  won?: boolean;
}

export function getPointsUserId(): string | null {
  return localStorage.getItem(POINTS_USER_KEY);
}

export function setPointsUserId(userId: string): void {
  localStorage.setItem(POINTS_USER_KEY, userId);
}

/** 确保已注册积分用户（首次会调 register 并持久化 user_id） */
export async function ensurePointsUser(): Promise<string> {
  let userId = getPointsUserId();
  if (userId) return userId;
  const baseUrl = await getAPIBaseUrl();
  const res = await fetch(`${baseUrl}/points/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data = await res.json().catch(() => ({}));
  userId = data.user_id;
  if (!userId) throw new Error(data.error || 'Register failed');
  setPointsUserId(userId);
  return userId;
}

async function pointsRequest<T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const baseUrl = await getAPIBaseUrl();
  const userId = await ensurePointsUser();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userId}`,
    ...(options.headers as Record<string, string> || {}),
  };
  const response = await fetch(`${baseUrl}${endpoint}`, { ...options, headers });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const pointsAPI = {
  me: (): Promise<PointsUser> => pointsRequest<PointsUser>('/points/me'),
  updateProfile: (data: { country?: string; city?: string }): Promise<PointsUser> =>
    pointsRequest<PointsUser>('/points/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  inviteBind: (inviteCode: string): Promise<{ success: true; points: number }> =>
    pointsRequest('/points/invite/bind', {
      method: 'POST',
      body: JSON.stringify({ invite_code: inviteCode }),
    }),
};

/** 全球华人福气地图统计（无需登录） */
export async function getMapStats(): Promise<MapStatsResponse> {
  const baseUrl = await getAPIBaseUrl();
  const res = await fetch(`${baseUrl}/map/stats`);
  if (!res.ok) throw new Error('Failed to load map stats');
  return res.json();
}

export const predictionsAPI = {
  topics: (): Promise<PredictionTopic[]> => pointsRequest<PredictionTopic[]>('/predictions/topics'),
  stake: (topicId: string, optionId: string, points: number): Promise<{ success: true; points: number }> =>
    pointsRequest('/predictions/stake', {
      method: 'POST',
      body: JSON.stringify({ topic_id: topicId, option_id: optionId, points }),
    }),
  myStakes: (): Promise<MyStake[]> => pointsRequest<MyStake[]>('/predictions/my-stakes'),
};
