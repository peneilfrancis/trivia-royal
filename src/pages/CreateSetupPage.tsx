import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrangeButton } from '../components/OrangeButton';
import { GradientBar } from '../components/GradientBar';
import { loadDraft, saveDraft } from '../utils/storage';
import { Game } from '../types';

export const CreateSetupPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [theme, setTheme] = useState('');
  const [categories, setCategories] = useState<[string, string, string, string]>([
    '',
    '',
    '',
    '',
  ]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      if (draft.name) setName(draft.name);
      if (draft.theme) setTheme(draft.theme);
      if (draft.categories && draft.categories.length === 4) {
        setCategories([...draft.categories] as [string, string, string, string]);
      }
    }
  }, []);

  const handleCategoryChange = (index: number, value: string) => {
    const updated = [...categories] as [string, string, string, string];
    updated[index] = value;
    setCategories(updated);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter a Game Name.');
      return;
    }

    if (categories.some((c) => !c.trim())) {
      setError('All 4 Category titles are required.');
      return;
    }

    const currentDraft = loadDraft() || {};
    const updatedDraft: Partial<Game> = {
      ...currentDraft,
      id: currentDraft.id || 'game-' + Date.now(),
      name: name.trim(),
      theme: theme.trim(),
      categories: [
        categories[0].trim(),
        categories[1].trim(),
        categories[2].trim(),
        categories[3].trim(),
      ],
      cards:
        currentDraft.cards && currentDraft.cards.length === 20
          ? currentDraft.cards
          : Array.from({ length: 20 }, () => ({ question: '', answer: '' })),
    };

    saveDraft(updatedDraft);
    navigate('/create/board');
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
          padding: '24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <OrangeButton variant="secondary" size="small" onClick={() => navigate('/play')}>
          ← Back
        </OrangeButton>
        <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'var(--title-gold)' }}>
          GAME SETUP
        </h1>
        <div style={{ width: '80px' }} />
      </div>

      {/* Setup Form */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 48px',
        }}
      >
        <form
          onSubmit={handleNext}
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '24px',
            padding: '36px 48px',
            width: '840px',
            boxShadow: 'var(--card-shadow)',
            border: '3px solid var(--card-yellow)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {error && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                color: '#B91C1C',
                padding: '12px 18px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '15px',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Game Name & Theme */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>
                Game Name <span style={{ color: '#E81A08' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Science Bowl 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid #D1D5DB',
                  fontSize: '17px',
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '16px', fontWeight: 800, marginBottom: '6px' }}>
                Theme / Description <span style={{ fontSize: '13px', color: '#6B7280' }}>(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. General Knowledge"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '2px solid #D1D5DB',
                  fontSize: '17px',
                  fontWeight: 600,
                }}
              />
            </div>
          </div>

          {/* Categories */}
          <div>
            <label style={{ display: 'block', fontSize: '18px', fontWeight: 800, margin: '8px 0 12px 0' }}>
              4 Categories <span style={{ color: '#E81A08' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {categories.map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--card-yellow)',
                      color: 'var(--card-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    placeholder={`Category ${idx + 1} Title`}
                    value={cat}
                    onChange={(e) => handleCategoryChange(idx, e.target.value)}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '2px solid #D1D5DB',
                      fontSize: '16px',
                      fontWeight: 600,
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <OrangeButton type="submit" size="large" style={{ padding: '14px 40px', fontSize: '20px' }}>
              Next: Board Editor →
            </OrangeButton>
          </div>
        </form>
      </div>

      <GradientBar height={30} />
    </div>
  );
};
