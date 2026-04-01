import type {
    PokemonApiBaseItem,
    PokemonDetailsResponse,
    PokemonListItem,
    PokemonNamesResponse,
    PokemonSearchResponse,
    PokemonTypeResponse,
    PokemonTypeSummary,
} from './pokemonModels';

const BASE_URL: string = 'http://localhost:3100';

const cache = new Map<string, unknown>();

async function cachedFetch<T>(url: string): Promise<T> {
    if (cache.has(url)) {
        return cache.get(url) as T;
    }

    const res: Response = await fetch(url);

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