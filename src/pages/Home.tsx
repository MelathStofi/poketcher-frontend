import React, { JSX, useEffect, useMemo, useState } from 'react';
import LoadingSpinner from '../components/loading-spinner/LoadingSpinner';
import SearchBar from '../components/search-bar/SeachBar';
import SortSelector, {SortOption} from '../components/sort-selector/SortSelector';
import TypeSelector from '../components/type-selector/TypeSelector';
import PokemonCard from '../components/pokemon-card/PokemonCard';
import {
    fetchAllPokemonNames,
    fetchPokemonTypes,
    fetchPokemonsByType,
    searchPokemons,
} from '../lib/pokemonApi';
import type { PokemonListItem, PokemonTypeSummary } from '../lib/pokemonModels';

export default function Home(): JSX.Element {
    const [types, setTypes] = useState<PokemonTypeSummary[]>([]);
    const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
    const [allPokemons, setAllPokemons] = useState<PokemonListItem[]>([]);
    const [selectedType, setSelectedType] = useState<string>('all');
    const [selectedSort, setSelectedSort] = useState<SortOption>('id-asc');
    const [query, setQuery] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect((): void => {
        const loadInitialData = async (): Promise<void> => {
            setIsLoading(true);
            try {
                const [typesData, namesData] = await Promise.all([
                    fetchPokemonTypes(),
                    fetchAllPokemonNames(),
                ]);

                setTypes(typesData);
                setAllPokemons(namesData);
                setPokemons(namesData);
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
    }, [query, selectedType, allPokemons]);

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
                            }
                        }}
                        showCaughtOnly={false}
                        onCaughtToggle={(): void => undefined}
                    />
                </div>

                <div className="home-page__filters">
                    <TypeSelector
                        types={types}
                        selectedType={selectedType}
                        onTypeChange={(value: string): void => {
                            setSelectedType(value);
                            setQuery('');
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
                        {sortedPokemons.map((pokemon: PokemonListItem): JSX.Element => (
                            <PokemonCard
                                key={pokemon.id}
                                pokemon={{ ...pokemon, types: [] }}
                                isCaught={false}
                                types={[]}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}