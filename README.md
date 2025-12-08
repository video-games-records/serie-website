# Video Games Records - Serie Website

A Nuxt 4 application for managing video game records with multi-series support and dynamic themes.

## 🎮 Features

- **Multi-Series Support**: Dynamic subdomain-based series detection
- **Dynamic Themes**: Tailwind CSS themes per series (Mario Kart, Forza, etc.)
- **TypeScript**: Full TypeScript support with strict typing
- **Auto-Import**: Components, composables, and utilities auto-imported
- **API Integration**: Connected to Symfony backend
- **State Management**: Pinia stores with TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Symfony API backend running

### Installation

```bash
# Install dependencies
npm install

# Set up environment (optional)
cp .env.example .env
# Edit API_BASE_URL if needed
```

### Development

```bash
# Start development server
npm run dev

# Access different series:
# http://mario-kart.videogamesrecords.local:3000
# http://forza.videogamesrecords.local:3000
# etc.
```

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Generate static site
npm run generate
```

## 📁 Project Structure

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
└── serieStore.ts  # Pinia store for games and series

types/             # TypeScript definitions
├── game.ts        # Game entity
├── platform.ts    # Platform entity  
├── serie.ts       # Serie entity
├── api.ts         # API responses
└── index.ts       # Exports

assets/styles/     # Theme CSS files
├── mario-kart.css
├── forza.css
└── ...
```

## 🛠️ Configuration

### Environment Variables

```bash
# .env
API_BASE_URL=http://backoffice.vgr.local/api
```

### Supported Series

- Mario Kart (`mario-kart.videogamesrecords.local`)
- Forza (`forza.videogamesrecords.local`) 
- Super Smash Bros (`super-smash-bros.videogamesrecords.local`)
- TrackMania (`trackmania.videogamesrecords.local`)
- Trials (`trials.videogamesrecords.local`)
- Mario & Sonic Olympic (`mario-sonic-olympic.videogamesrecords.local`)
- Gran Turismo (`gran-turismo.videogamesrecords.local`)

## 🎨 Adding New Series

1. Add series config in `config/series.ts`
2. Create theme CSS in `assets/styles/{series-name}.css`
3. Add to `allowedHosts` in `nuxt.config.ts`

## 📚 Technology Stack

- **Framework**: Nuxt 4.2.1
- **Frontend**: Vue 3.5.25 + TypeScript
- **Styling**: Tailwind CSS
- **State**: Pinia
- **Backend**: Symfony API

## 🔗 API Endpoints

- `GET /api/series/{id}` - Get series details
- `GET /api/series/{id}/games` - Get games for series
- `GET /game/{id}/picture` - Get game image

For more details, see [CLAUDE.md](./CLAUDE.md) for development guidance.
