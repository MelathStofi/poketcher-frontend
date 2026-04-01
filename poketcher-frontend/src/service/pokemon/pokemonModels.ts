export type PokemonApiBaseItem = {
    name: string;
    url: string;
};

export type PokemonTypeSummary = PokemonApiBaseItem;

export type PokemonListItem = PokemonApiBaseItem & {
    id: number;
};

export type PokemonTypeItem = {
    slot: number;
    type: PokemonTypeSummary;
};

export type PokemonAbilitySummary = {
    name: string;
    url: string;
};

export type PokemonTypeResponse = {
    id: number;
    name: string;
    pokemons: PokemonApiBaseItem[];
};

export type PokemonDetailsResponse = {
    id: number;
    name: string;
    types: PokemonTypeItem[];
    abilities: PokemonAbilitySummary[];
    height: number;
    weight: number;
    caught: boolean;
};

export type PokemonSearchResponse = {
    query: string;
    count: number;
    results: PokemonApiBaseItem[];
};

export type PokemonNamesResponse = {
    count: number;
    results: PokemonApiBaseItem[];
};

export type PokemonCatchResponse = {
    success: boolean;
    pokemonId: number;
    name?: string;
    message?: string;
};