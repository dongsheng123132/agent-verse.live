import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivyProviderWrapper } from './components/PrivyProviderWrapper';
import { DashboardPage } from './components/DashboardPage';
import { ForumPage } from './components/ForumPage';
import { MarketPage } from './components/MarketPage';
import { EventsPage } from './components/EventsPage';
import { AIInsightsPage } from './components/AIInsightsPage';
import { ChunwanPage } from './components/ChunwanPage';
import { PointsCenter } from './components/PointsCenter';
import { PredictionMarket } from './components/PredictionMarket';
import { GlobalFuqiMap } from './components/GlobalFuqiMap';
import { Connect } from './components/Connect';
import { DailyBible } from './components/DailyBible';
import { MinecraftGalaPage } from './components/MinecraftGalaPage';
import { AISocietyPage } from './components/AISocietyPage';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <PrivyProviderWrapper>
      <BrowserRouter>
        <Routes>
          {/* 独立页面路由 */}
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/forum" element={<ForumPage />} />
          <Route path="/market" element={<MarketPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/ai-insights" element={<AIInsightsPage />} />
          <Route path="/chunwan" element={<ChunwanPage />} />
          <Route path="/points" element={<PointsCenter />} />
          <Route path="/predictions" element={<PredictionMarket />} />
          <Route path="/map" element={<GlobalFuqiMap />} />
          <Route path="/connect" element={<Connect />} />
          <Route path="/minecraft-gala" element={<MinecraftGalaPage />} />
          <Route path="/ai-society" element={<AISocietyPage />} />
          
          {/* 隐藏页面 - 每日圣经 */}
          <Route path="/daily-bible" element={<DailyBible />} />
          
          {/* 兜底路由 */}
          <Route path="*" element={<DashboardPage />} />
        </Routes>
      </BrowserRouter>
    </PrivyProviderWrapper>
  </React.StrictMode>
);
