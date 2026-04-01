import React, { JSX, useEffect, useMemo, useState } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';
import SearchBar from '../components/SeachBar';
import SortSelector, { SortOption } from '../components/SortSelector';
import TypeSelector from '../components/TypeSelector';
import PokemonCard from '../components/PokemonCard';
import {
    fetchAllPokemonNames,
    fetchCaughtPokemons,
    fetchPokemonTypes,
    fetchPokemonsByType,
    searchPokemons,
} from '../service/pokemon/pokemonService';
import type { PokemonDetailsResponse, PokemonListItem, PokemonTypeSummary } from '../service/pokemon/pokemonModels';

const HOME_FILTERS_STORAGE_KEY: string = 'poketcher_home_filters';

type HomeFiltersState = {
    selectedType: string;
    selectedSort: SortOption;
    query: string;
    showCaughtOnly: boolean;
};

function getSavedHomeFilters(): HomeFiltersState {
    const rawValue: string | null = sessionStorage.getItem(HOME_FILTERS_STORAGE_KEY);

    if (!rawValue) {
        return {
            selectedType: 'all',
            selectedSort: 'id-asc',
            query: '',
            showCaughtOnly: false,
        };
    }

    try {
        const parsed: unknown = JSON.parse(rawValue);

        if (
            typeof parsed === 'object' &&
            parsed !== null &&
            'selectedType' in parsed &&
            'selectedSort' in parsed &&
            'query' in parsed &&
            'showCaughtOnly' in parsed
        ) {
            const typed = parsed as HomeFiltersState;
            return {
                selectedType: typeof typed.selectedType === 'string' ? typed.selectedType : 'all',
                selectedSort:
                    typed.selectedSort === 'id-asc' ||
                    typed.selectedSort === 'id-desc' ||
                    typed.selectedSort === 'name-asc' ||
                    typed.selectedSort === 'name-desc'
                        ? typed.selectedSort
                        : 'id-asc',
                query: typeof typed.query === 'string' ? typed.query : '',
                showCaughtOnly: typeof typed.showCaughtOnly === 'boolean' ? typed.showCaughtOnly : false,
            };
        }
    } catch {
        // ignore malformed storage
    }

    return {
        selectedType: 'all',
        selectedSort: 'id-asc',
        query: '',
        showCaughtOnly: false,
    };
}

export default function Home(): JSX.Element {
    const savedFilters: HomeFiltersState = getSavedHomeFilters();

    const [types, setTypes] = useState<PokemonTypeSummary[]>([]);
    const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
    const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
    const [caughtPokemons, setCaughtPokemons] = useState<PokemonDetailsResponse[]>([]);
    const [selectedType, setSelectedType] = useState<string>(savedFilters.selectedType);
    const [selectedSort, setSelectedSort] = useState<SortOption>(savedFilters.selectedSort);
    const [query, setQuery] = useState<string>(savedFilters.query);
    const [showCaughtOnly, setShowCaughtOnly] = useState<boolean>(savedFilters.showCaughtOnly);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect((): void => {
        const filters: HomeFiltersState = {
            selectedType,
            selectedSort,
            query,
            showCaughtOnly,
        };

        sessionStorage.setItem(HOME_FILTERS_STORAGE_KEY, JSON.stringify(filters));
    }, [selectedType, selectedSort, query, showCaughtOnly]);

    useEffect((): void => {
        const loadInitialData = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const [typesData, namesData, caughtData] = await Promise.all([
                    fetchPokemonTypes(),
                    fetchAllPokemonNames(),
                    fetchCaughtPokemons(),
                ]);

                setTypes(typesData);
                setAllPokemons(namesData);
                setPokemons(namesData);
                setCaughtPokemons(caughtData);
            } finally {
                setIsLoading(false);
            }
        };

        void loadInitialData();
    }, []);

    useEffect((): void => {
        const loadFilteredPokemons = async (): Promise<void> => {
            setIsLoading(true);
            try {
                if (showCaughtOnly) {
                    const caughtData: PokemonDetailsResponse[] = await fetchCaughtPokemons();
                    setCaughtPokemons(caughtData);

                    setPokemons(
                        caughtData.map((pokemon: PokemonDetailsResponse): PokemonListItem => ({
                            id: pokemon.id,
                            name: pokemon.name,
                            url: `${window.location.origin}/pokemon/${pokemon.id}`,
                        })),
                    );
                    return;
                }

                if (query.trim().length >= 2) {
                    const searchResults = await searchPokemons(query.trim());
                    setPokemons(searchResults);
                    return;
                }

                if (selectedType !== 'all') {
                    const typeResults = await fetchPokemonsByType(selectedType);
                    setPokemons(typeResults);
                    return;
                }

                setPokemons(allPokemons);
            } finally {
                setIsLoading(false);
            }
        };

        void loadFilteredPokemons();
    }, [query, selectedType, showCaughtOnly, allPokemons]);

    const sortedPokemons = useMemo<PokemonListItem[]>((): PokemonListItem[] => {
        const list = [...pokemons];

        switch (selectedSort) {
            case 'id-desc':
                return list.sort((a: PokemonListItem, b: PokemonListItem): number => b.id - a.id);
            case 'name-asc':
                return list.sort((a: PokemonListItem, b: PokemonListItem): number => a.name.localeCompare(b.name));
            case 'name-desc':
                return list.sort((a: PokemonListItem, b: PokemonListItem): number => b.name.localeCompare(a.name));
            case 'id-asc':
            default:
                return list.sort((a: PokemonListItem, b: PokemonListItem): number => a.id - b.id);
        }
    }, [pokemons, selectedSort]);

    return (
        <div className="home-page">
            <div className="home-page__content">
                <div className="home-page__search">
                    <SearchBar
                        query={query}
                        onQueryChange={(value: string): void => {
                            setQuery(value);
                            if (value.trim().length >= 2) {
                                setSelectedType('all');
                                setShowCaughtOnly(false);
                            }
                        }}
                        showCaughtOnly={showCaughtOnly}
                        onCaughtToggle={(checked: boolean): void => {
                            setShowCaughtOnly(checked);
                            if (checked) {
                                setQuery('');
                                setSelectedType('all');
                            }
                        }}
                    />
                </div>

                <div className="home-page__filters">
                    <TypeSelector
                        types={types}
                        selectedType={selectedType}
                        onTypeChange={(value: string): void => {
                            setSelectedType(value);
                            setQuery('');
                            setShowCaughtOnly(false);
                        }}
                        isLoading={isLoading}
                    />
                    <SortSelector
                        selectedSort={selectedSort}
                        onSortChange={(value: SortOption): void => setSelectedSort(value)}
                    />
                </div>

                {isLoading ? (
                    <LoadingSpinner text="Pokémonok betöltése..." />
                ) : (
                    <div className="pokemon-grid">
                        {sortedPokemons.map((pokemon: PokemonListItem): JSX.Element => {
                            const caught: boolean = caughtPokemons.some(
                                (caughtPokemon: PokemonDetailsResponse): boolean => caughtPokemon.id === pokemon.id,
                            );

                            return (
                                <PokemonCard
                                    key={pokemon.id}
                                    pokemon={{ ...pokemon, types: [] }}
                                    isCaught={caught}
                                    types={[]}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}