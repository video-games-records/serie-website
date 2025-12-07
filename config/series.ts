// config/series.ts
export const SERIES = {
    FORZA: 1,
    MARIO_KART: 2,
    SUPER_SMASH_BROS: 3,
    TRACKMANIA: 7,
    TRIALS: 12,
    MARIO_SONIC_OLYMPIC: 16,
    GRAN_TURISMO: 22,
}

export interface Serie {
    id: number
    name: string
    subdomain: string
    theme: string
    primaryColor: string
    secondaryColor: string
    accentColor: string
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
    },
    'mario-kart': {
        id: 2,
        name: 'Mario Kart',
        subdomain: 'mario-kart',
        theme: 'mario-kart',
        primaryColor: '#E60012',
        secondaryColor: '#FFCC00',
        accentColor: '#1F1F1F',
    },
    'super-smash-bros': {
        id: 3,
        name: 'Super Smash Bros',
        subdomain: 'super-smash-bros',
        theme: 'super-smash-bros',
        primaryColor: '#FF6B00',
        secondaryColor: '#0066FF',
        accentColor: '#FFD700',
    },
    'trackmania': {
        id: 7,
        name: 'TrackMania',
        subdomain: 'trackmania',
        theme: 'trackmania',
        primaryColor: '#FF4500',
        secondaryColor: '#32CD32',
        accentColor: '#FFFFFF',
    },
    'trials': {
        id: 12,
        name: 'Trials',
        subdomain: 'trials',
        theme: 'trials',
        primaryColor: '#8B0000',
        secondaryColor: '#FF4500',
        accentColor: '#FFD700',
    },
    'mario-sonic-olympic': {
        id: 16,
        name: 'Mario & Sonic at the Olympic Games',
        subdomain: 'mario-sonic-olympic',
        theme: 'mario-sonic-olympic',
        primaryColor: '#0080FF',
        secondaryColor: '#FFD700',
        accentColor: '#FF1493',
    },
    'gran-turismo': {
        id: 22,
        name: 'Gran Turismo',
        subdomain: 'gran-turismo',
        theme: 'gran-turismo',
        primaryColor: '#1E3A8A',
        secondaryColor: '#DC2626',
        accentColor: '#F59E0B',
    },
}

export function getSerieFromHostname(host: string): Serie | null {
    const subdomain = host.split('.')[0]
    return SERIES_CONFIG[subdomain] || SERIES_CONFIG['mario-kart']
}
