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

  // 本地开发：优先 localhost，不可用时用远程
  const localOk = await checkAPI(LOCAL_API_URL.replace('/api/v1', ''));
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
