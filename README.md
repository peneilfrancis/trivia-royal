# Trivia Royale

A clean, responsive, presentation-ready quiz show game built for big screens, laptops, and projectors.

## Features

- **Fixed 1280x720 Scaled Stage**: Crisp, pixel-perfect rendering that automatically adapts to projector and display resolutions.
- **Client-Side Persistence**: Fast, offline-first experience using browser `localStorage` and `sessionStorage` (zero backend required).
- **Game Creator (Flow A)**:
  - 4 categories $\times$ 5 rows ($100$ to $500$ points) = 20 interactive cards.
  - Image attachment support with automatic client-side resizing and compression to prevent storage quotas.
  - Draft auto-save and duplicate game name collision prevention.
- **Play Flow (Flow B)**:
  - 2 to 6 customizable teams with vibrant distinct color badges.
  - Interactive board with dimming used cards.
  - Card detail view with question, optional clue images, and click-to-reveal answers.
  - Real-time score chips supporting exact score editing, dynamic step adjustments, and one-click **Undo**.
  - Final podium standings with medal tiers and tie-break detection.
- **Pre-Seeded Demo**: Includes the *"Campus Quiz Night"* game pre-loaded for instant demonstration and testing.

## Tech Stack

- **React 18** with **TypeScript**
- **Vite** bundler
- **React Router** in `HashRouter` mode (ready for GitHub Pages)
- **Montserrat** Google Typography
- **Vanilla CSS** with design token variables

## Getting Started

### Prerequisites

Ensure you have Node.js (v18+) installed.

### Installation

```bash
cd trivia-royale
npm install
```

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

Deployable to any static host or GitHub Pages out of the box!
