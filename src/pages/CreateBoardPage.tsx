import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrangeButton } from '../components/OrangeButton';
import { YellowCard } from '../components/YellowCard';
import { Modal } from '../components/Modal';
import { GradientBar } from '../components/GradientBar';
import { loadDraft, saveDraft, saveGame, listGames } from '../utils/storage';
import { Game, Card } from '../types';

export const CreateBoardPage: React.FC = () => {
  const navigate = useNavigate();

  const [draft, setDraft] = useState<Partial<Game> | null>(null);
  const [editingCardIndex, setEditingCardIndex] = useState<number | null>(null);

  // Card editor inputs
  const [cardQuestion, setCardQuestion] = useState('');
  const [cardAnswer, setCardAnswer] = useState('');
  const [cardImage, setCardImage] = useState<string | undefined>(undefined);
  const [cardError, setCardError] = useState<string | null>(null);

  // Save Game modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [saveGameName, setSaveGameName] = useState('');
  const [nameCollisionError, setNameCollisionError] = useState(false);

  // Unsaved changes warning modal
  const [isBackWarningOpen, setIsBackWarningOpen] = useState(false);

  useEffect(() => {
    const loaded = loadDraft();
    if (!loaded || !loaded.name || !loaded.categories) {
      navigate('/create/setup');
      return;
    }
    // Ensure 20 cards
    if (!loaded.cards || loaded.cards.length !== 20) {
      loaded.cards = Array.from({ length: 20 }, () => ({ question: '', answer: '' }));
    }
    setDraft(loaded);
    setSaveGameName(loaded.name || '');
  }, [navigate]);

  if (!draft || !draft.categories || !draft.cards) {
    return null;
  }

  const filledCount = draft.cards.filter((c) => c.question.trim() && c.answer.trim()).length;

  // Open card editor
  const handleOpenCard = (index: number) => {
    const card = draft.cards![index];
    setEditingCardIndex(index);
    setCardQuestion(card.question || '');
    setCardAnswer(card.answer || '');
    setCardImage(card.image);
    setCardError(null);
  };

  // Image resize and compress to ~800px wide
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        let { width, height } = img;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          setCardImage(compressedDataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Save card
  const handleSaveCard = () => {
    if (!cardQuestion.trim() || !cardAnswer.trim()) {
      setCardError('Both question and answer are required.');
      return;
    }

    if (editingCardIndex === null) return;

    const updatedCards = [...draft.cards!];
    updatedCards[editingCardIndex] = {
      question: cardQuestion.trim(),
      answer: cardAnswer.trim(),
      image: cardImage,
    };

    const updatedDraft = { ...draft, cards: updatedCards };
    setDraft(updatedDraft);
    saveDraft(updatedDraft);
    setEditingCardIndex(null);
  };

  // Save entire game
  const handleSaveGameConfirm = (override: boolean = false) => {
    if (!saveGameName.trim()) return;

    const existingGames = listGames();
    const collision = existingGames.find(
      (g) => g.name.toLowerCase() === saveGameName.trim().toLowerCase() && g.id !== draft.id
    );

    if (collision && !override) {
      setNameCollisionError(true);
      return;
    }

    const finalGame: Game = {
      id: draft.id || 'game-' + Date.now(),
      name: saveGameName.trim(),
      theme: draft.theme || '',
      categories: draft.categories as [string, string, string, string],
      cards: draft.cards as Card[],
      updatedAt: Date.now(),
    };

    const res = saveGame(finalGame);
    if (res.success) {
      setIsSaveModalOpen(false);
      navigate('/games');
    } else {
      alert(res.error || 'Failed to save');
    }
  };

  // Row and point helpers
  // index = row * 4 + col
  // points = (row + 1) * 100
  const getCategoryAndPoints = (index: number) => {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const cat = draft.categories![col];
    const pts = (row + 1) * 100;
    return `${cat.toUpperCase()} · ${pts} POINTS`;
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
          padding: '16px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <OrangeButton variant="secondary" size="small" onClick={() => setIsBackWarningOpen(true)}>
            ← Back
          </OrangeButton>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#374151' }}>
            {draft.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 800,
              color: filledCount === 20 ? '#15803D' : '#D97706',
              backgroundColor: filledCount === 20 ? '#DCFCE7' : '#FEF3C7',
              padding: '6px 14px',
              borderRadius: '20px',
            }}
          >
            {filledCount} / 20 cards filled
          </span>

          <OrangeButton size="small" onClick={() => setIsSaveModalOpen(true)}>
            Save Game
          </OrangeButton>
        </div>
      </div>

      {/* 4x5 Board Grid */}
      <div
        style={{
          flex: 1,
          padding: '16px 36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {/* Categories Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {draft.categories.map((cat, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--title-gold)',
                color: '#2B2000',
                padding: '12px',
                borderRadius: '12px',
                textAlign: 'center',
                fontWeight: 900,
                fontSize: '17px',
                textTransform: 'uppercase',
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* 5 Rows of Cards (100 to 500) */}
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateRows: 'repeat(5, 1fr)',
            gap: '10px',
          }}
        >
          {[0, 1, 2, 3, 4].map((row) => (
            <div
              key={row}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
              }}
            >
              {[0, 1, 2, 3].map((col) => {
                const index = row * 4 + col;
                const card = draft.cards![index];
                const isFilled = card && card.question.trim() && card.answer.trim();
                const points = (row + 1) * 100;

                return (
                  <YellowCard
                    key={col}
                    clickable
                    onClick={() => handleOpenCard(index)}
                    style={{
                      height: '100%',
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderRadius: '12px',
                      border: isFilled ? '2px solid #EAB308' : '2px dashed #D1D5DB',
                      backgroundColor: isFilled ? 'var(--card-yellow)' : '#FFFBEB',
                    }}
                  >
                    <span style={{ fontSize: '24px', fontWeight: 900, color: '#3B2A00' }}>
                      {points}
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '6px',
                        backgroundColor: isFilled ? '#15803D' : '#9CA3AF',
                        color: '#FFFFFF',
                      }}
                    >
                      {isFilled ? 'Filled' : 'Empty'}
                    </span>
                  </YellowCard>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Card Editor Modal */}
      {editingCardIndex !== null && (
        <Modal
          isOpen={true}
          onClose={() => setEditingCardIndex(null)}
          title={getCategoryAndPoints(editingCardIndex)}
          width="640px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {cardError && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  color: '#B91C1C',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '14px',
                }}
              >
                ⚠️ {cardError}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>
                Question <span style={{ color: '#E81A08' }}>*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Type the question here..."
                value={cardQuestion}
                onChange={(e) => setCardQuestion(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '2px solid #D1D5DB',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>
                Answer <span style={{ color: '#E81A08' }}>*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Type the correct answer here..."
                value={cardAnswer}
                onChange={(e) => setCardAnswer(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '2px solid #D1D5DB',
                  fontSize: '16px',
                  fontWeight: 600,
                }}
              />
            </div>

            {/* Optional Image */}
            <div>
              <label style={{ display: 'block', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>
                Optional Image
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ fontSize: '14px' }}
                />
                {cardImage && (
                  <button
                    type="button"
                    onClick={() => setCardImage(undefined)}
                    style={{
                      color: '#E81A08',
                      fontWeight: 700,
                      fontSize: '13px',
                      textDecoration: 'underline',
                    }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
              {cardImage && (
                <div style={{ marginTop: '10px' }}>
                  <img
                    src={cardImage}
                    alt="Card Preview"
                    style={{
                      maxHeight: '140px',
                      borderRadius: '8px',
                      border: '1px solid #D1D5DB',
                    }}
                  />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
              <OrangeButton variant="secondary" onClick={() => setEditingCardIndex(null)}>
                Cancel
              </OrangeButton>
              <OrangeButton onClick={handleSaveCard}>Save Card</OrangeButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Save Game Modal */}
      <Modal
        isOpen={isSaveModalOpen}
        onClose={() => {
          setIsSaveModalOpen(false);
          setNameCollisionError(false);
        }}
        title="Save Game"
        width="500px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>
              Game Name
            </label>
            <input
              type="text"
              value={saveGameName}
              onChange={(e) => {
                setSaveGameName(e.target.value);
                setNameCollisionError(false);
              }}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '2px solid #D1D5DB',
                fontSize: '16px',
                fontWeight: 600,
              }}
            />
          </div>

          {nameCollisionError && (
            <div
              style={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              ⚠️ A game with this name already exists. Would you like to overwrite it or rename?
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <OrangeButton
                  size="small"
                  variant="danger"
                  onClick={() => handleSaveGameConfirm(true)}
                >
                  Overwrite Existing
                </OrangeButton>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <OrangeButton variant="secondary" onClick={() => setIsSaveModalOpen(false)}>
              Cancel
            </OrangeButton>
            <OrangeButton onClick={() => handleSaveGameConfirm(false)}>
              Save and Exit
            </OrangeButton>
          </div>
        </div>
      </Modal>

      {/* Unsaved Changes Modal */}
      <Modal
        isOpen={isBackWarningOpen}
        onClose={() => setIsBackWarningOpen(false)}
        title="Unsaved Changes"
        width="460px"
      >
        <p style={{ fontSize: '16px', fontWeight: 500, color: '#4B5563', marginBottom: '20px' }}>
          Are you sure you want to go back? Your current card edits are saved in your draft, but you
          have not finalized the game yet.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <OrangeButton variant="secondary" onClick={() => setIsBackWarningOpen(false)}>
            Stay Here
          </OrangeButton>
          <OrangeButton variant="danger" onClick={() => navigate('/play')}>
            Leave Editor
          </OrangeButton>
        </div>
      </Modal>

      <GradientBar height={24} />
    </div>
  );
};
