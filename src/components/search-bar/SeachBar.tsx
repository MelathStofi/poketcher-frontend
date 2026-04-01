import React, {ChangeEvent, JSX} from 'react';

export type SearchBarProps = {
    query: string;
    onQueryChange: (value: string) => void;
    showCaughtOnly: boolean;
    onCaughtToggle: (checked: boolean) => void;
};

export default function SearchBar({ query, onQueryChange, showCaughtOnly, onCaughtToggle }: SearchBarProps): JSX.Element {
    return (
        <div className="search-bar">
            <div className="search-bar__input-wrap">
                <svg className="search-bar__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                    type="text"
                    className="search-bar__input"
                    placeholder="Pokémon keresése név alapján..."
                    value={query}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => onQueryChange(e.target.value)}
                />
            </div>
            <div className="search-bar__filter">
                <input
                    type="checkbox"
                    id="caughtOnly"
                    className="search-bar__checkbox"
                    checked={showCaughtOnly}
                    onChange={(e: ChangeEvent<HTMLInputElement>): void => onCaughtToggle(e.target.checked)}
                />
                <label htmlFor="caughtOnly">Csak elkapottak</label>
            </div>
        </div>
    );
}