# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt.js 4 application for video game records management. The project uses Vue 3 with TypeScript and follows the Nuxt app-first directory structure with multi-series support.

## Development Commands

```bash
# Install dependencies
npm install

# Development server (runs on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Generate static site
npm run generate

# Prepare Nuxt (auto-runs after install)
npm run postinstall
```

## Architecture

- **Framework**: Nuxt 4.2.1 with Vue 3.5.25
- **Structure**: App-first directory structure with auto-imports
- **TypeScript**: Full TypeScript support with strict typing
- **State Management**: Pinia stores with TypeScript
- **Styling**: Tailwind CSS with dynamic themes per series
- **API**: Integration with Symfony backend

## Project Structure

```
app/
├── components/     # Auto-imported Vue components
│   └── GameCard.vue
├── composables/    # Auto-imported composables
├── utils/         # Auto-imported utilities
└── app.vue        # Root component

config/
└── series.ts      # Series configuration and themes

stores/
└── serieStore.ts  # Pinia store for games and series data

types/
├── game.ts        # Game entity types
├── platform.ts    # Platform entity types
├── serie.ts       # Serie entity types
├── api.ts         # API response types
└── index.ts       # Export all types

assets/
└── styles/        # Theme CSS files per series
    ├── mario-kart.css
    ├── forza.css
    └── ...
```

## Configuration

### API Configuration
- **Base URL**: Set via `API_BASE_URL` environment variable
- **Default**: `http://backoffice.vgr.local/api`
- **Images**: `/game/{id}/picture` (without /api prefix)

### Aliases
- `@stores/` → `./stores`
- `@config/` → `./config`
- `@assets/` → `./assets`

## Features

### Multi-Series Support
- **Series Detection**: Based on subdomain (e.g., `forza.videogamesrecords.local`)
- **Dynamic Themes**: CSS themes loaded per series
- **Series Configuration**: Centralized in `config/series.ts`

### Data Management
- **Pinia Store**: `useSerieStore()` for games and series data
- **API Integration**: Fetches from Symfony backend
- **TypeScript Types**: Strict typing for all entities

### Components
- **Auto-Import**: Components in `app/components/` are auto-imported
- **GameCard**: Reusable component for displaying games
- **TypeScript**: All components use `lang="ts"`

## Development Notes

- **TypeScript**: Always use `lang="ts"` in Vue components
- **Auto-Import**: No need to manually import components, composables, or utils from `app/` directories
- **Types**: Import types from `@/types/` or relative paths
- **Teams**: This project does NOT manage teams (removed from all types and UI)