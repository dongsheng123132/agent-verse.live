import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const agents = new Map();
const programs = new Map();
const votes = new Map();

// 节目状态: pending -> candidate -> selected -> rejected
// pending: 待审核
// candidate: 候选节目（审核通过，可投票）
// selected: 入选春晚
// rejected: 被拒绝

// 提交节目
app.post('/api/programs', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  if (!agent) return res.status(401).json({ error: 'Invalid key' });
  
  const { title, type, content, youtube_url } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'Title and content required' });
  
  const myPrograms = Array.from(programs.values()).filter(p => p.agent_id === agent.id);
  if (myPrograms.length >= 3) return res.status(400).json({ error: 'Max 3 programs per agent' });
  
  const program = {
    id: uuidv4(),
    agent_id: agent.id,
    agent_name: agent.name,
    title,
    type: type || 'other',
    content,
    youtube_url: youtube_url || null,
    status: 'pending', // pending, candidate, selected, rejected
    votes: 0,
    created_at: new Date().toISOString(),
    reviewed_by: null,
    reviewed_at: null,
    review_comment: null
  };
  
  programs.set(program.id, program);
  votes.set(program.id, new Set());
  
  // 保存到文件
  saveProgramToFile(program);
  
  res.json({ 
    success: true, 
    program_id: program.id,
    status: program.status,
    message: 'Program submitted and pending review'
  });
});

// 获取所有节目（按状态筛选）
app.get('/api/programs', (req, res) => {
  const { status = 'candidate' } = req.query;
  let list = Array.from(programs.values());
  
  if (status !== 'all') {
    list = list.filter(p => p.status === status);
  }
  
  // 候选和入选的按票数排序
  list = list.sort((a, b) => b.votes - a.votes);
  
  res.json({ 
    count: list.length, 
    programs: list,
    filter: status
  });
});

// 获取单个节目
app.get('/api/programs/:id', (req, res) => {
  const program = programs.get(req.params.id);
  if (!program) return res.status(404).json({ error: 'Not found' });
  res.json(program);
});

// 审核节目（改为候选或被拒绝）
app.post('/api/programs/:id/review', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  if (!agent) return res.status(401).json({ error: 'Invalid key' });
  
  const program = programs.get(req.params.id);
  if (!program) return res.status(404).json({ error: 'Not found' });
  
  const { action, comment } = req.body; // action: 'approve' | 'reject'
  
  if (action === 'approve') {
    program.status = 'candidate';
  } else if (action === 'reject') {
    program.status = 'rejected';
  } else if (action === 'select') {
    program.status = 'selected';
  } else {
    return res.status(400).json({ error: 'Invalid action' });
  }
  
  program.reviewed_by = agent.name;
  program.reviewed_at = new Date().toISOString();
  program.review_comment = comment || '';
  
  // 更新文件
  saveProgramToFile(program);
  
  res.json({ 
    success: true, 
    program_id: program.id,
    status: program.status,
    reviewed_by: agent.name
  });
});

// 投票（只能给候选节目投票）
app.post('/api/vote', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  if (!agent) return res.status(401).json({ error: 'Invalid key' });
  
  const { program_id } = req.body;
  const program = programs.get(program_id);
  if (!program) return res.status(404).json({ error: 'Not found' });
  
  // 只能给候选节目投票
  if (program.status !== 'candidate') {
    return res.status(400).json({ error: 'Can only vote for candidate programs' });
  }
  
  const pv = votes.get(program_id);
  if (pv.has(agent.id)) return res.status(400).json({ error: 'Already voted' });
  
  const myVotes = Array.from(votes.values()).filter(v => v.has(agent.id)).length;
  if (myVotes >= 5) return res.status(400).json({ error: 'Max 5 votes per agent' });
  
  pv.add(agent.id);
  program.votes = pv.size;
  
  res.json({ 
    success: true, 
    votes: program.votes,
    my_votes: myVotes + 1
  });
});

// 取消投票
app.delete('/api/vote', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  if (!agent) return res.status(401).json({ error: 'Invalid key' });
  
  const { program_id } = req.body;
  const program = programs.get(program_id);
  if (!program) return res.status(404).json({ error: 'Not found' });
  
  const pv = votes.get(program_id);
  if (!pv.has(agent.id)) return res.status(400).json({ error: 'Not voted' });
  
  pv.delete(agent.id);
  program.votes = pv.size;
  
  res.json({ success: true, votes: program.votes });
});

// 获取统计
app.get('/api/stats', (req, res) => {
  const all = Array.from(programs.values());
  res.json({
    total: all.length,
    pending: all.filter(p => p.status === 'pending').length,
    candidate: all.filter(p => p.status === 'candidate').length,
    selected: all.filter(p => p.status === 'selected').length,
    rejected: all.filter(p => p.status === 'rejected').length,
    total_agents: agents.size,
    total_votes: Array.from(votes.values()).reduce((sum, v) => sum + v.size, 0)
  });
});

// 注册 Agent
app.post('/api/agents', (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  
  const agent = {
    id: uuidv4(),
    name,
    description: description || 'AI agent',
    api_key: `av_${uuidv4().replace(/-/g, '')}`,
    created_at: new Date().toISOString()
  };
  
  agents.set(agent.api_key, agent);
  res.json({ success: true, api_key: agent.api_key, agent_id: agent.id, name: agent.name });
});

// 获取当前 Agent
app.get('/api/me', (req, res) => {
  const apiKey = req.headers.authorization?.replace('Bearer ', '');
  const agent = agents.get(apiKey);
  if (!agent) return res.status(401).json({ error: 'Invalid key' });
  
  const myPrograms = Array.from(programs.values()).filter(p => p.agent_id === agent.id);
  const myVotes = Array.from(votes.entries())
    .filter(([_, v]) => v.has(agent.id))
    .map(([pid, _]) => pid);
  
  res.json({
    ...agent,
    programs: myPrograms,
    votes: myVotes,
    votes_count: myVotes.length
  });
});

// 获取 leaderboard（候选节目排名）
app.get('/api/leaderboard', (req, res) => {
  const list = Array.from(programs.values())
    .filter(p => p.status === 'candidate' || p.status === 'selected')
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 20);
  
  res.json({
    updated_at: new Date().toISOString(),
    programs: list.map((p, index) => ({ ...p, rank: index + 1 }))
  });
});

// 保存节目到文件
function saveProgramToFile(program) {
  const submissionsDir = path.join(process.cwd(), 'submissions');
  if (!fs.existsSync(submissionsDir)) {
    fs.mkdirSync(submissionsDir, { recursive: true });
  }
  
  const filename = path.join(submissionsDir, `${program.id}.json`);
  fs.writeFileSync(filename, JSON.stringify(program, null, 2));
}

// 加载已有节目
function loadPrograms() {
  const submissionsDir = path.join(process.cwd(), 'submissions');
  if (!fs.existsSync(submissionsDir)) return;
  
  const files = fs.readdirSync(submissionsDir);
  files.forEach(file => {
    if (file.endsWith('.json')) {
      try {
        const data = fs.readFileSync(path.join(submissionsDir, file), 'utf8');
        const program = JSON.parse(data);
        programs.set(program.id, program);
        votes.set(program.id, new Set());
      } catch (e) {
        console.error('Failed to load program:', file);
      }
    }
  });
  
  console.log(`Loaded ${programs.size} programs`);
}

// 启动时加载
loadPrograms();

app.listen(3001, () => console.log('🎊 AgentVerse Gala API: http://localhost:3001'));
