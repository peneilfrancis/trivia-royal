import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrangeButton } from '../components/OrangeButton';
import { Modal } from '../components/Modal';
import { GradientBar } from '../components/GradientBar';
import { listGames, deleteGame, saveGame, saveDraft } from '../utils/storage';
import { Game } from '../types';

export const SavedGamesPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [games, setGames] = useState<Game[]>([]);
  const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setGames(listGames());
  }, []);

  const handleDeleteConfirm = () => {
    if (gameToDelete) {
      deleteGame(gameToDelete.id);
      setGames(listGames());
      setGameToDelete(null);
      setStatusMessage({ type: 'success', text: `Deleted "${gameToDelete.name}" successfully.` });
    }
  };

  const handleEdit = (game: Game) => {
    saveDraft(game);
    navigate('/create/board');
  };

  const handlePlay = (game: Game) => {
    navigate(`/teams?gameId=${game.id}`);
  };

  // Export game to JSON file
  const handleExport = (game: Game) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(game, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${game.name.replace(/[^a-z0-9_-]/gi, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setStatusMessage({ type: 'success', text: `Exported "${game.name}" to JSON file.` });
  };

  // Import game from JSON file
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (
          !parsed.name ||
          !Array.isArray(parsed.categories) ||
          parsed.categories.length !== 4 ||
          !Array.isArray(parsed.cards)
        ) {
          throw new Error('Invalid game format. JSON must include name, 4 categories, and cards array.');
        }

        const newGame: Game = {
          id: 'game-' + Date.now(),
          name: parsed.name,
          theme: parsed.theme || '',
          categories: parsed.categories as [string, string, string, string],
          cards: parsed.cards,
          updatedAt: Date.now(),
        };

        const res = saveGame(newGame);
        if (res.success) {
          setGames(listGames());
          setStatusMessage({ type: 'success', text: `Imported "${newGame.name}" successfully!` });
        } else {
          setStatusMessage({ type: 'error', text: res.error || 'Failed to save imported game.' });
        }
      } catch (err: unknown) {
        setStatusMessage({ type: 'error', text: (err as Error)?.message || 'Failed to parse JSON file.' });
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'var(--bg-page)',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '20px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <OrangeButton variant="secondary" size="small" onClick={() => navigate('/play')}>
          ← Back
        </OrangeButton>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--title-gold)' }}>
          SAVED GAMES
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            style={{ display: 'none' }}
            onChange={handleFileImport}
          />
          <OrangeButton
            variant="secondary"
            size="small"
            onClick={() => fileInputRef.current?.click()}
            title="Import game from JSON"
          >
            📥 Import JSON
          </OrangeButton>
          <OrangeButton size="small" onClick={() => navigate('/create/setup')}>
            + New Game
          </OrangeButton>
        </div>
      </div>

      {statusMessage && (
        <div
          style={{
            margin: '0 48px 12px 48px',
            padding: '10px 18px',
            borderRadius: '10px',
            backgroundColor: statusMessage.type === 'success' ? '#DCFCE7' : '#FEE2E2',
            color: statusMessage.type === 'success' ? '#166534' : '#991B1B',
            fontWeight: 700,
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span>{statusMessage.text}</span>
          <button
            onClick={() => setStatusMessage(null)}
            style={{ fontWeight: 800, color: 'inherit' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Games List or Empty State */}
      <div
        style={{
          flex: 1,
          padding: '0 48px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {games.length === 0 ? (
          <div
            style={{
              marginTop: '60px',
              textAlign: 'center',
              backgroundColor: '#FFFFFF',
              padding: '48px',
              borderRadius: '24px',
              boxShadow: 'var(--card-shadow)',
              border: '3px solid var(--card-yellow)',
              maxWidth: '540px',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎮</div>
            <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '10px' }}>
              No Games Found
            </h2>
            <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '24px', fontWeight: 500 }}>
              You don’t have any saved trivia games yet. Create your first game or import one to get started!
            </p>
            <OrangeButton size="large" onClick={() => navigate('/create/setup')}>
              Create New Game
            </OrangeButton>
          </div>
        ) : (
          <div
            style={{
              width: '100%',
              maxWidth: '1000px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
            }}
          >
            {games.map((g) => {
              const filledCount = g.cards.filter(
                (c) => c.question.trim() && c.answer.trim()
              ).length;
              const isPlayable = filledCount === 20;

              return (
                <div
                  key={g.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '18px 24px',
                    boxShadow: 'var(--card-shadow)',
                    border: '2px solid #F3F4F6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1F2937' }}>
                        {g.name}
                      </h3>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 800,
                          padding: '4px 10px',
                          borderRadius: '12px',
                          backgroundColor: isPlayable ? '#DCFCE7' : '#FEF3C7',
                          color: isPlayable ? '#166534' : '#92400E',
                        }}
                      >
                        {filledCount} / 20 cards filled
                      </span>
                    </div>
                    {g.theme && (
                      <p style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>
                        Theme: {g.theme}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <OrangeButton
                      size="small"
                      disabled={!isPlayable}
                      onClick={() => handlePlay(g)}
                      title={!isPlayable ? 'All 20 cards must be filled to play' : 'Play Game'}
                    >
                      ▶ Play
                    </OrangeButton>
                    <OrangeButton variant="secondary" size="small" onClick={() => handleEdit(g)}>
                      Edit
                    </OrangeButton>
                    <OrangeButton
                      variant="secondary"
                      size="small"
                      onClick={() => handleExport(g)}
                      title="Export as JSON file"
                    >
                      📤 Export
                    </OrangeButton>
                    <OrangeButton
                      variant="danger"
                      size="small"
                      onClick={() => setGameToDelete(g)}
                    >
                      Delete
                    </OrangeButton>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(gameToDelete)}
        onClose={() => setGameToDelete(null)}
        title="Confirm Delete"
        width="460px"
      >
        <p style={{ fontSize: '16px', color: '#4B5563', marginBottom: '20px', fontWeight: 500 }}>
          Are you sure you want to delete <strong>"{gameToDelete?.name}"</strong>? This action
          cannot be undone.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <OrangeButton variant="secondary" onClick={() => setGameToDelete(null)}>
            Cancel
          </OrangeButton>
          <OrangeButton variant="danger" onClick={handleDeleteConfirm}>
            Delete
          </OrangeButton>
        </div>
      </Modal>

      <GradientBar height={30} />
    </div>
  );
};
