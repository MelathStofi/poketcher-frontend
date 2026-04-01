import type {
    PokemonApiBaseItem,
    PokemonCatchResponse,
    PokemonDetailsResponse,
    PokemonListItem,
    PokemonNamesResponse,
    PokemonSearchResponse,
    PokemonTypeResponse,
    PokemonTypeSummary,
} from './pokemonModels';
import { BASE_URL } from '../serviceUtil';

const cache = new Map<string, unknown>();
const imageCache = new Set<string>();

async function cachedFetch<T>(url: string): Promise<T> {
    if (cache.has(url)) {
        return cache.get(url) as T;
    }

    const res: Response = await fetch(url, {
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    const data: T = await res.json();
    cache.set(url, data);
    return data;
}

function toPokemonListItem(item: PokemonApiBaseItem): PokemonListItem {
    return {
        ...item,
        id: parseInt(item.url.split('/').filter(Boolean).pop() ?? '0', 10),
    };
}

export async function fetchPokemonTypes(): Promise<PokemonTypeSummary[]> {
    return cachedFetch<PokemonTypeSummary[]>(`${BASE_URL}/pokemon/types`);
}

export async function fetchPokemonsByType(typeName: string): Promise<PokemonListItem[]> {
    const data: PokemonTypeResponse = await cachedFetch<PokemonTypeResponse>(
        `${BASE_URL}/pokemon/types/${encodeURIComponent(typeName)}`,
    );

    return data.pokemons.map(toPokemonListItem);
}

export async function fetchPokemonDetails(nameOrId: string): Promise<PokemonDetailsResponse> {
    return cachedFetch<PokemonDetailsResponse>(`${BASE_URL}/pokemon/${encodeURIComponent(nameOrId)}`);
}

export async function fetchCaughtPokemons(): Promise<PokemonDetailsResponse[]> {
    return cachedFetch<PokemonDetailsResponse[]>(`${BASE_URL}/pokemon/caught`);
}

export async function catchPokemon(nameOrId: string): Promise<PokemonCatchResponse> {
    const res: Response = await fetch(`${BASE_URL}/pokemon/catch/${encodeURIComponent(nameOrId)}`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    cache.clear();
    return res.json() as Promise<PokemonCatchResponse>;
}

export async function releasePokemon(nameOrId: string): Promise<PokemonCatchResponse> {
    const res: Response = await fetch(`${BASE_URL}/pokemon/release/${encodeURIComponent(nameOrId)}`, {
        method: 'POST',
        credentials: 'include',
    });

    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`);
    }

    cache.clear();
    return res.json() as Promise<PokemonCatchResponse>;
}

export async function searchPokemons(query: string): Promise<PokemonListItem[]> {
    if (!query || query.length < 2) return [];

    const data: PokemonSearchResponse = await cachedFetch<PokemonSearchResponse>(
        `${BASE_URL}/pokemon/search?q=${encodeURIComponent(query)}`,
    );

    return data.results.map(toPokemonListItem);
}

export async function fetchAllPokemonNames(): Promise<PokemonListItem[]> {
    const data: PokemonNamesResponse = await cachedFetch<PokemonNamesResponse>(`${BASE_URL}/pokemon/names`);
    return data.results.map(toPokemonListItem);
}

export function getPokemonImageUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export function getPokemonSpriteUrl(id: number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

export function preloadPokemonImage(id: number): void {
    const url: string = getPokemonImageUrl(id);

    if (imageCache.has(url)) {
        return;
    }

    const image: HTMLImageElement = new Image();
    image.src = url;
    imageCache.add(url);
}