import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrivyProviderWrapper } from './components/PrivyProviderWrapper';
import App from './App';
import { ChunwanPage } from './components/ChunwanPage';
import { PointsCenter } from './components/PointsCenter';
import { PredictionMarket } from './components/PredictionMarket';
import { GlobalFuqiMap } from './components/GlobalFuqiMap';

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
        <Route path="/chunwan" element={<ChunwanPage />} />
        <Route path="/forum" element={<App />} />
        <Route path="/points" element={<PointsCenter />} />
        <Route path="/predictions" element={<PredictionMarket />} />
        <Route path="/map" element={<GlobalFuqiMap />} />
        <Route path="/*" element={<App />} />
      </Routes>
    </BrowserRouter>
    </PrivyProviderWrapper>
  </React.StrictMode>
);