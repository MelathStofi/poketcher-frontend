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

export type PokemonTypeResponse = {
    id: number;
    name: string;
    pokemons: PokemonApiBaseItem[];
};

export type PokemonDetailsResponse = {
    id: number;
    name: string;
    types: PokemonTypeItem[];
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
