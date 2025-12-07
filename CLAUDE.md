# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Nuxt.js 4 application for video game records (specifically Mario Kart series based on package name). The project uses Vue 3 with TypeScript and follows the Nuxt minimal starter structure.

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
- **Structure**: App-first directory structure with `app/app.vue` as the root component
- **TypeScript**: Configured with Nuxt's auto-generated TypeScript config references
- **Development**: Nuxt devtools enabled in development mode

## Key Files

- `app/app.vue`: Root application component
- `nuxt.config.ts`: Nuxt configuration with devtools enabled
- `tsconfig.json`: TypeScript configuration using Nuxt's generated configs
- `public/`: Static assets (favicon, robots.txt)

## Development Notes

The project currently uses the default Nuxt welcome page. The TypeScript configuration relies on Nuxt's auto-generated config files in `.nuxt/` directory, which are created after running `nuxt prepare` or starting the dev server.