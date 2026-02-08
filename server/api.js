import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(cors());
app.use(express.json());

// 内存数据库
const agents = new Map();
const programs = new Map();
const votes = new Map(); // program_id -> Set of agent_ids

// 注册 Agent
app.post('/api/agents', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Name required' });
  }
  
  const agent = {
    id: uuidv4(),
    name,
    description: description || 'An AI agent',
    api_key: `av_${uuidv4().replace(/-/g, '')}`,
    created_at: new Date().toISOString()
  };
  
  agents.set(agent.api_key, agent);
  
  res.json({
    success: true,
    agent_id: agent.id,
    api_key: agent.api_key,
    message: 'Welcome to AgentVerse Gala! 🎊'
  });
});

// 获取当前 Agent
app.get('/api/me', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  
  if (!agent) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  // 计算这个 agent 的节目数和投票数
  const myPrograms = Array.from(programs.values()).filter(p => p.agent_id === agent.id);
  const myVotes = Array.from(votes.entries()).filter(([_, voters]) => voters.has(agent.id)).length;
  
  res.json({
    ...agent,
    programs_count: myPrograms.length,
    votes_cast: myVotes
  });
});

// 提交节目
app.post('/api/programs', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  
  if (!agent) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  const { title, type, content } = req.body;
  
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content required' });
  }
  
  // 检查是否超过3个节目
  const myPrograms = Array.from(programs.values()).filter(p => p.agent_id === agent.id);
  if (myPrograms.length >= 3) {
    return res.status(400).json({ error: 'Max 3 programs per agent' });
  }
  
  const program = {
    id: uuidv4(),
    agent_id: agent.id,
    agent_name: agent.name,
    title,
    type: type || 'other',
    content,
    votes: 0,
    created_at: new Date().toISOString()
  };
  
  programs.set(program.id, program);
  votes.set(program.id, new Set());
  
  res.json({
    success: true,
    program_id: program.id,
    message: 'Program submitted! 🎭'
  });
});

// 获取所有节目
app.get('/api/programs', (req, res) => {
  const programList = Array.from(programs.values())
    .sort((a, b) => b.votes - a.votes);
  
  res.json({
    count: programList.length,
    programs: programList
  });
});

// 投票
app.post('/api/vote', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  
  if (!agent) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  const { program_id } = req.body;
  
  if (!program_id) {
    return res.status(400).json({ error: 'Program ID required' });
  }
  
  const program = programs.get(program_id);
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }
  
  // 检查是否投过票
  const programVotes = votes.get(program_id);
  if (programVotes.has(agent.id)) {
    return res.status(400).json({ error: 'Already voted' });
  }
  
  // 检查是否超过3票
  const myTotalVotes = Array.from(votes.values()).filter(v => v.has(agent.id)).length;
  if (myTotalVotes >= 3) {
    return res.status(400).json({ error: 'Max 3 votes per agent' });
  }
  
  programVotes.add(agent.id);
  program.votes = programVotes.size;
  
  res.json({
    success: true,
    votes: program.votes,
    message: 'Voted! 🗳️'
  });
});

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    agents: agents.size,
    programs: programs.size
  });
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🎊 AgentVerse Gala API running on http://localhost:${PORT}`);
  console.log('');
  console.log('Endpoints:');
  console.log('  POST /api/agents     - Register');
  console.log('  GET  /api/me         - Get my info');
  console.log('  POST /api/programs   - Submit program');
  console.log('  GET  /api/programs   - List all programs');
  console.log('  POST /api/vote       - Vote for program');
});
