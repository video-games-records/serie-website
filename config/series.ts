// config/series.ts
import type { Serie } from '~/types/serie'

export const SERIES = {
    FORZA: 1,
    MARIO_KART: 2,
    SUPER_SMASH_BROS: 3,
    TRACKMANIA: 7,
    TRIALS: 12,
    MARIO_SONIC_OLYMPIC: 16,
    GRAN_TURISMO: 22,
    BURNOUT: 36,
}

export const SERIES_CONFIG: Record<string, Serie> = {
    'forza': {
        id: 1,
        name: 'Forza',
        subdomain: 'forza',
        theme: 'forza',
        primaryColor: '#1B4620',
        secondaryColor: '#FFD700',
        accentColor: '#000000',
        gaId: 'G-FORZA123456',
    },
    'mario-kart': {
        id: 2,
        name: 'Mario Kart',
        subdomain: 'mario-kart',
        theme: 'mario-kart',
        primaryColor: '#E60012',
        secondaryColor: '#FFCC00',
        accentColor: '#1F1F1F',
        gaId: 'G-MARIO123456',
    },
    'super-smash-bros': {
        id: 3,
        name: 'Super Smash Bros',
        subdomain: 'super-smash-bros',
        theme: 'super-smash-bros',
        primaryColor: '#FF6B00',
        secondaryColor: '#0066FF',
        accentColor: '#FFD700',
        gaId: 'G-SSB123456',
    },
    'trackmania': {
        id: 7,
        name: 'TrackMania',
        subdomain: 'trackmania',
        theme: 'trackmania',
        primaryColor: '#FF4500',
        secondaryColor: '#32CD32',
        accentColor: '#FFFFFF',
        gaId: 'G-TM123456',
    },
    'trials': {
        id: 12,
        name: 'Trials',
        subdomain: 'trials',
        theme: 'trials',
        primaryColor: '#8B0000',
        secondaryColor: '#FF4500',
        accentColor: '#FFD700',
        gaId: 'G-TRIALS123456',
    },
    'mario-sonic-olympic': {
        id: 16,
        name: 'Mario & Sonic at the Olympic Games',
        subdomain: 'mario-sonic-olympic',
        theme: 'mario-sonic-olympic',
        primaryColor: '#0080FF',
        secondaryColor: '#FFD700',
        accentColor: '#FF1493',
        gaId: 'G-MSO123456',
        links: [
            {
                name: 'Discord Community',
                type: 'discord',
                url: 'https://discord.gg/pXJca8TrnT'
            }
        ],
    },
    'gran-turismo': {
        id: 22,
        name: 'Gran Turismo',
        subdomain: 'gran-turismo',
        theme: 'gran-turismo',
        primaryColor: '#1E3A8A',
        secondaryColor: '#DC2626',
        accentColor: '#F59E0B',
        gaId: 'G-GT123456',
    },
    'burnout': {
        id: 36,
        name: 'Burnout',
        subdomain: 'burnout',
        theme: 'burnout',
        primaryColor: '#FF6600',
        secondaryColor: '#000000',
        accentColor: '#FFFF00',
        gaId: 'G-BURNOUT123456',
        links: [
            {
                name: 'Discord Community',
                type: 'discord',
                url: 'https://discord.com/invite/r6z82wBkYd'
            },
            {
                name: 'World Crash Rankings',
                type: 'website',
                url: 'https://www.crashmoderankings.com/'
            }
        ],
    },
}

export function getSerieFromHostname(host: string): Serie | null {
    const subdomain = host.split('.')[0]
    return SERIES_CONFIG[subdomain] || SERIES_CONFIG['mario-kart']
}
