import React, { JSX, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPokemonSpriteUrl, preloadPokemonImage } from '../service/pokemon/pokemonService';
import TypeBadge from './TypeBadge';

type PokemonCardProps = {
    pokemon: {
        id: number;
        name: string;
        types: string[];
    };
    isCaught: boolean;
    types: string[];
};

export default function PokemonCard({ pokemon, isCaught, types }: PokemonCardProps): JSX.Element {
    const imageUrl: string = getPokemonSpriteUrl(pokemon.id);

    useEffect((): void => {
        preloadPokemonImage(pokemon.id);
    }, [pokemon.id]);

    return (
        <Link
            to={`/pokemon/${pokemon.name}`}
            className={`pokemon-card ${isCaught ? 'pokemon-card--caught' : ''}`}
        >
            {isCaught && (
                <div className="pokemon-card__caught-badge">✓</div>
            )}

            <div className="pokemon-card__image-wrap">
                <img
                    src={imageUrl}
                    alt={pokemon.name}
                    className="pokemon-card__image"
                    loading="lazy"
                />
            </div>

            <div className="pokemon-card__info">
                <p className="pokemon-card__id">#{String(pokemon.id).padStart(4, '0')}</p>
                <h3 className="pokemon-card__name">{pokemon.name}</h3>
                {types && types.length > 0 && (
                    <div className="pokemon-card__types">
                        {types.map((t: string): JSX.Element => <TypeBadge key={t} type={t} />)}
                    </div>
                )}
            </div>
        </Link>
    );
}