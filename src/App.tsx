import React, { useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Stage } from './components/Stage';
import { seedGames } from './utils/storage';
import { StartPage } from './pages/StartPage';
import { PlayOptionsPage } from './pages/PlayOptionsPage';
import { CreateSetupPage } from './pages/CreateSetupPage';
import { CreateBoardPage } from './pages/CreateBoardPage';
import { SavedGamesPage } from './pages/SavedGamesPage';
import { TeamSetupPage } from './pages/TeamSetupPage';
import { GameBoardPage } from './pages/GameBoardPage';
import { CardScreenPage } from './pages/CardScreenPage';
import { RankingPage } from './pages/RankingPage';

export const App: React.FC = () => {
  useEffect(() => {
    // Seed initial demo game if localStorage is empty
    seedGames();
  }, []);

  return (
    <HashRouter>
      <Stage>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/play" element={<PlayOptionsPage />} />
          <Route path="/create/setup" element={<CreateSetupPage />} />
          <Route path="/create/board" element={<CreateBoardPage />} />
          <Route path="/games" element={<SavedGamesPage />} />
          <Route path="/teams" element={<TeamSetupPage />} />
          <Route path="/game" element={<GameBoardPage />} />
          <Route path="/card/:index" element={<CardScreenPage />} />
          <Route path="/ranking" element={<RankingPage />} />
        </Routes>
      </Stage>
    </HashRouter>
  );
};
