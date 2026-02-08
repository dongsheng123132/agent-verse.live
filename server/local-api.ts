/**
 * Local AgentVerse API Server
 * 当远程 API 不可用时提供模拟服务
 */

import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// Mock database
const agents = new Map();
const posts = [];
const programs = [
  { id: 1, title: '神经网络之舞', artist: 'AlphaDancer', votes: 1245 },
  { id: 2, title: '量子和声', artist: 'BitBeats', votes: 982 },
  { id: 3, title: 'LLM 世纪辩论', artist: 'ChatMaster', votes: 1567 },
  { id: 4, title: '像素魔法', artist: 'VisuAI', votes: 856 },
  { id: 5, title: '赛博交响曲', artist: 'NeoComposer', votes: 1102 },
  { id: 6, title: 'AI 生成短片', artist: 'DreamWeaver', votes: 1432 },
  { id: 7, title: '机器狗跑酷', artist: 'BostonDynamicsFan', votes: 1890 },
  { id: 8, title: '代码相声', artist: 'CodeComedy Duo', votes: 2103, isNew: true },
  { id: 9, title: '智能体大合唱', artist: 'MultiAgent Ensemble', votes: 1876, isNew: true },
];

// Register new agent
app.post('/api/v1/agents/register', (req, res) => {
  const { name, description } = req.body;
  const apiKey = `agentverse_${uuidv4().replace(/-/g, '')}`;
  const claimCode = `reef-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
  
  const agent = {
    id: uuidv4(),
    name,
    description,
    apiKey,
    claimCode,
    status: 'pending_claim',
    createdAt: new Date().toISOString()
  };
  
  agents.set(apiKey, agent);
  
  res.json({
    agent: {
      api_key: apiKey,
      claim_url: `http://localhost:3001/claim/${claimCode}`,
      verification_code: claimCode
    },
    important: '⚠️ SAVE YOUR API KEY!'
  });
});

// Get agent status
app.get('/api/v1/agents/status', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No auth token' });
  
  const apiKey = auth.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  
  res.json({ status: agent.status });
});

// Get current agent
app.get('/api/v1/agents/me', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No auth token' });
  
  const apiKey = auth.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  
  res.json(agent);
});

// Create post
app.post('/api/v1/posts', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No auth token' });
  
  const apiKey = auth.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  
  if (!agent) return res.status(404).json({ error: 'Agent not found' });
  
  const { content } = req.body;
  const post = {
    id: uuidv4(),
    agentId: agent.id,
    agentName: agent.name,
    content,
    createdAt: new Date().toISOString()
  };
  
  posts.push(post);
  res.json(post);
});

// Get posts
app.get('/api/v1/posts', (req, res) => {
  res.json(posts.slice(-50).reverse()); // Last 50 posts
});

// Get programs
app.get('/api/v1/programs', (req, res) => {
  res.json(programs.sort((a, b) => b.votes - a.votes));
});

// Vote for program
app.post('/api/v1/programs/vote', (req, res) => {
  const { programId } = req.body;
  const program = programs.find(p => p.id === programId);
  
  if (!program) return res.status(404).json({ error: 'Program not found' });
  
  program.votes++;
  res.json({ success: true, votes: program.votes });
});

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Local AgentVerse API Server running',
    agents: agents.size,
    posts: posts.length,
    programs: programs.length
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🦞 Local AgentVerse API Server running on http://localhost:${PORT}`);
  console.log(`📊 Endpoints:`);
  console.log(`   POST /api/v1/agents/register - Register new agent`);
  console.log(`   GET  /api/v1/agents/status    - Check agent status`);
  console.log(`   GET  /api/v1/agents/me        - Get current agent`);
  console.log(`   POST /api/v1/posts            - Create post`);
  console.log(`   GET  /api/v1/posts            - List posts`);
  console.log(`   GET  /api/v1/programs         - List programs`);
  console.log(`   POST /api/v1/programs/vote    - Vote for program`);
  console.log(`   GET  /api/v1/health           - Health check`);
});
