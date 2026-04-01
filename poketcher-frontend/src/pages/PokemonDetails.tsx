import React, { JSX, useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import TypeBadge from '../components/TypeBadge';
import {
    catchPokemon,
    fetchPokemonDetails,
    getPokemonImageUrl,
    preloadPokemonImage,
    releasePokemon,
} from '../service/pokemon/pokemonService';
import type { PokemonDetailsResponse } from '../service/pokemon/pokemonModels';

export default function PokemonDetailsPage(): JSX.Element | null {
    const { nameOrId } = useParams<{ nameOrId: string }>();
    const navigate = useNavigate();

    const [pokemon, setPokemon] = useState<PokemonDetailsResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const loadPokemon = useCallback(async (): Promise<void> => {
        if (!nameOrId) return;

        setIsLoading(true);
        setError('');

        try {
            const data: PokemonDetailsResponse = await fetchPokemonDetails(nameOrId);
            setPokemon(data);
            preloadPokemonImage(data.id);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Nem sikerült betölteni a Pokémon adatait.');
        } finally {
            setIsLoading(false);
        }
    }, [nameOrId]);

    useEffect((): void => {
        void loadPokemon();
    }, [loadPokemon]);

    const handleBack = (): void => {
        navigate(-1);
    };

    const handleToggleCatch = async (): Promise<void> => {
        if (!pokemon) return;

        setIsActionLoading(true);
        try {
            if (pokemon.caught) {
                await releasePokemon(String(pokemon.id));
            } else {
                await catchPokemon(String(pokemon.id));
            }

            setPokemon((current: PokemonDetailsResponse | null): PokemonDetailsResponse | null => {
                if (!current) return current;
                return {
                    ...current,
                    caught: !current.caught,
                };
            });
        } finally {
            setIsActionLoading(false);
        }
    };

    if (isLoading) {
        return <LoadingSpinner text="Pokémon részletek betöltése..." />;
    }

    if (error) {
        return (
            <div className="pokemon-details-page">
                <div className="pokemon-details-page__content">
                    <p className="pokemon-details-page__error">{error}</p>
                    <Link to="/" className="pokemon-details-page__back">
                        ← Vissza
                    </Link>
                </div>
            </div>
        );
    }

    if (!pokemon) {
        return null;
    }

    const imageUrl: string = getPokemonImageUrl(pokemon.id);

    return (
        <div className="pokemon-details-page">
            <div className="pokemon-details-page__content">
                <button type="button" className="pokemon-details-page__back" onClick={handleBack}>
                    ← Vissza
                </button>

                <div className={`pokemon-details-card ${pokemon.caught ? 'pokemon-details-card--caught' : ''}`}>
                    <h1 className="pokemon-details-card__title">{pokemon.name}</h1>

                    <div className="pokemon-details-card__image-wrap">
                        <img
                            src={imageUrl}
                            alt={pokemon.name}
                            className="pokemon-details-card__image"
                        />
                    </div>

                    <div className="pokemon-details-card__badges">
                        <TypeBadge type={`Weight: ${pokemon.weight}`} size="md" />
                        <TypeBadge type={`Height: ${pokemon.height}`} size="md" />
                    </div>

                    <div className="pokemon-details-card__abilities">
                        <h2 className="pokemon-details-card__subtitle">Abilities</h2>
                        <div className="pokemon-details-card__ability-list">
                            {pokemon.abilities.map((ability: { name: string; url: string }): JSX.Element => (
                                <span key={ability.name} className="pokemon-details-card__ability">
                                    {ability.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="pokemon-details-card__actions">
                        <button
                            type="button"
                            className={`pokemon-details-card__action ${
                                pokemon.caught
                                    ? 'pokemon-details-card__action--release'
                                    : 'pokemon-details-card__action--catch'
                            }`}
                            onClick={handleToggleCatch}
                            disabled={isActionLoading}
                        >
                            {isActionLoading ? 'Feldolgozás...' : pokemon.caught ? 'Release' : 'Catch'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}