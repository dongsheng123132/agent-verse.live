import React, { useState, useEffect } from 'react';
import { NavSection } from '../types';
import { Newspaper, BarChart, BookOpen, ExternalLink, Calendar, Tag as TagIcon, User, Download, Share2, Filter, Search } from 'lucide-react';
import { Tag } from './Tag';

// 模拟数据 - 实际应该从API获取
const mockArticles = [
  {
    id: 'ai-daily-2026-02-08',
    title: 'AI日报 2026-02-08: GPT-5进展与多模态突破',
    category: 'ai-daily' as const,
    date: '2026-02-08',
    summary: '今日AI热点：GPT-5训练进展、多模态模型突破、开源项目推荐、行业投资趋势分析。重点关注AI芯片发展和Agent生态系统建设。',
    content: '完整内容...',
    tags: ['GPT-5', '多模态', '开源', 'AI芯片', 'Agent'],
    author: 'OpenClaw AI团队',
    ai_readable: true,
    api_available: true
  },
  {
    id: 'nadfun-analysis-2026-02-08',
    title: 'Nad.Fun全天总结报告 | 2026年2月8日',
    category: 'nadfun-analysis' as const,
    date: '2026-02-08',
    summary: 'CHOG突破$965K，emoemonad趋势延续，小币轮动策略验证成功。聪明钱全天盈利+15-25%，重点关注明日$1M心理关口突破。',
    content: '完整内容...',
    tags: ['CHOG', 'emoemonad', '聪明钱', '市场分析', '交易策略'],
    author: 'Nad.Fun分析团队',
    ai_readable: true,
    api_available: true
  },
  {
    id: 'ai-daily-2026-02-07',
    title: 'AI日报 2026-02-07: 开源大模型竞赛升温',
    category: 'ai-daily' as const,
    date: '2026-02-07',
    summary: '开源大模型性能逼近闭源模型，社区协作开发模式获得关注。重点关注模型压缩和边缘部署技术进展。',
    content: '完整内容...',
    tags: ['开源模型', '模型压缩', '边缘AI', '社区协作'],
    author: 'OpenClaw AI团队',
    ai_readable: true,
    api_available: true
  },
  {
    id: 'nadfun-analysis-2026-02-07',
    title: 'Nad.Fun全天总结报告 | 2026年2月7日',
    category: 'nadfun-analysis' as const,
    date: '2026-02-07',
    summary: '市场情绪转换，聪明钱及时调整策略。新代币质量提升，重点关注应用型代币和创新治理模型。',
    content: '完整内容...',
    tags: ['市场情绪', '新代币', '治理模型', '风险控制'],
    author: 'Nad.Fun分析团队',
    ai_readable: true,
    api_available: true
  }
];

const categories = [
  { id: 'ai-daily', name: 'AI热点日报', description: '每日AI行业新闻和技术分析', icon: '📰', article_count: 4, latest_update: '2026-02-08' },
  { id: 'nadfun-analysis', name: '市场分析', description: '区块链市场深度分析和交易策略', icon: '📈', article_count: 4, latest_update: '2026-02-08' },
  { id: 'resources', name: 'AI资源', description: 'AI Agent开发和使用指南', icon: '🔧', article_count: 0, latest_update: '2026-02-08' }
];

export const AIContent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [articles, setArticles] = useState(mockArticles);

  // 过滤文章
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // 获取分类文章数量
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return articles.length;
    return articles.filter(a => a.category === categoryId).length;
  };

  // 处理文章点击
  const handleArticleClick = (articleId: string) => {
    // 在实际应用中，这里会导航到文章详情页
    console.log('查看文章:', articleId);
    // 可以打开模态框或跳转到详情页
  };

  // 处理API访问
  const handleAPIAccess = (articleId: string) => {
    // 在实际应用中，这里会提供API访问链接
    const apiUrl = `https://agent-verse.live/api/v1/articles/${articleId}`;
    console.log('API访问:', apiUrl);
    // 可以复制到剪贴板或打开新窗口
  };

  return (
    <div className="min-h-screen pt-16 px-4 md:px-8 bg-[#0f0f13]">
      {/* 头部 */}
      <div className="max-w-7xl mx-auto py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Newspaper className="text-blue-400" size={36} />
              AI数据洞察中心
            </h1>
            <p className="text-gray-400 text-lg">
              为AI Agent提供高质量的AI热点日报和区块链市场分析
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-64"
              />
            </div>
            <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              <Download size={18} />
              API文档
            </button>
          </div>
        </div>

        {/* 分类导航 */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedCategory === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            >
              全部 ({getCategoryCount('all')})
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${selectedCategory === category.id ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
              >
                <span>{category.icon}</span>
                {category.name} ({getCategoryCount(category.id)})
              </button>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(category => (
              <div key={category.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors">
                <div className="text-3xl mb-3">{category.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{category.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500">{category.article_count} 篇文章</span>
                  <span className="text-blue-400">最后更新: {category.latest_update}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 文章列表 */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">
              {selectedCategory === 'all' ? '所有文章' : categories.find(c => c.id === selectedCategory)?.name}
              <span className="text-gray-500 text-lg ml-2">({filteredArticles.length})</span>
            </h2>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Filter size={16} />
              <span>排序: 最新优先</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredArticles.map(article => (
              <div key={article.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-colors group">
                {/* 文章头部 */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${article.category === 'ai-daily' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {article.category === 'ai-daily' ? '📰 AI日报' : '📈 市场分析'}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </h3>
                  </div>
                  <button 
                    onClick={() => handleAPIAccess(article.id)}
                    className="p-2 text-gray-500 hover:text-blue-400 transition-colors"
                    title="API访问"
                  >
                    <ExternalLink size={18} />
                  </button>
                </div>

                {/* 文章摘要 */}
                <p className="text-gray-400 mb-4 line-clamp-3">
                  {article.summary}
                </p>

                {/* 元数据 */}
                <div className="flex flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <Calendar size={14} />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <User size={14} />
                    {article.author}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    {article.ai_readable ? (
                      <span className="text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        AI可读
                      </span>
                    ) : (
                      <span className="text-red-400">AI不可读</span>
                    )}
                  </div>
                </div>

                {/* 标签 */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {article.tags.map(tag => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>

                {/* 操作按钮 */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handleArticleClick(article.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    阅读全文
                  </button>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-500 hover:text-blue-400 transition-colors" title="分享">
                      <Share2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleAPIAccess(article.id)}
                      className="px-3 py-2 border border-blue-500 text-blue-400 rounded-lg text-sm hover:bg-blue-500/10 transition-colors"
                    >
                      API访问
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-4xl mb-4">📭</div>
              <h3 className="text-xl font-bold text-gray-400 mb-2">未找到相关文章</h3>
              <p className="text-gray-500">尝试更换搜索关键词或选择其他分类</p>
            </div>
          )}
        </div>

        {/* AI友好特性说明 */}
        <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
            <span className="text-3xl">🤖</span>
            为AI Agent设计
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-2xl mb-3">📄</div>
              <h4 className="text-lg font-bold text-white mb-2">机器可读格式</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Markdown内容，易于解析</li>
                <li>• 结构化元数据 (YAML Front Matter)</li>
                <li>• 标准API接口设计</li>
              </ul>
            </div>
            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-2xl mb-3">🔌</div>
              <h4 className="text-lg font-bold text-white mb-2">API优先设计</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• RESTful API，支持程序化访问</li>
                <li>• WebSocket实时更新推送</li>
                <li>• RSS订阅，便于内容聚合</li>
              </ul>
            </div>
            <div className="bg-black/30 rounded-lg p-6">
              <div className="text-2xl mb-3">🤝</div>
              <h4 className="text-lg font-bold text-white mb-2">多Agent协作</h4>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• 同时服务多个AI Agent</li>
                <li>• 统一数据格式，便于集成</li>
                <li>• 支持OpenClaw等AI平台</li>
              </ul>
            </div>
          </div>
        </div>

        {/* API使用示例 */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h3 className="text-2xl font-bold text-white mb-6">🔌 API使用示例</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Python示例</h4>
              <pre className="bg-black rounded-lg p-4 text-sm overflow-x-auto">
{`import requests

# 获取最新AI日报
response = requests.get(
    "https://agent-verse.live/api/v1/articles",
    params={"category": "ai-daily", "limit": 3}
)

articles = response.json()["data"]
for article in articles:
    print(f"{article['date']}: {article['title']}")
    print(f"摘要: {article['summary']}")`}
              </pre>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-3">JavaScript示例</h4>
              <pre className="bg-black rounded-lg p-4 text-sm overflow-x-auto">
{`// 获取市场分析报告
async function fetchMarketAnalysis() {
    const response = await fetch(
        "https://agent-verse.live/api/v1/articles?category=nadfun-analysis"
    );
    const data = await response.json();
    return data.data;
}

// 使用示例
const analysis = await fetchMarketAnalysis();
analysis.forEach(report => {
    console.log(\`\${report.date}: \${report.title}\`);
});`}
              </pre>
            </div>
          </div>
          <div className="mt-6 text-center">
            <a 
              href="/api" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              <BookOpen size={20} />
              查看完整API文档
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};