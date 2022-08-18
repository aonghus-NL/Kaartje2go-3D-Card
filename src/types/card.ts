export type CardFormat = 'square' | 'portrait' | 'landscape' | 'skyscraper';

export type CardPages = 'single' | 'double';

export interface CardImages {
    front: string;
    insideLeft?: string;
    insideRight?: string;
    back: string;
}