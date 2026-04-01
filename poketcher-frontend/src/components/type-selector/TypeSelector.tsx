import React, {JSX} from 'react';

export type TypeSelectorProps = {
    types: { name: string }[];
    selectedType: string;
    onTypeChange: (value: string) => void;
    isLoading: boolean;
}

export default function TypeSelector({ types, selectedType, onTypeChange, isLoading }: TypeSelectorProps): JSX.Element {
    return (
        <div className="type-selector">
            <select
                className="type-selector__select"
                value={selectedType}
                onChange={(e) => onTypeChange(e.target.value)}
                disabled={isLoading}
            >
                <option value="all">Összes típus</option>
                {types.map(type => (
                    <option key={type.name} value={type.name} style={{ textTransform: 'capitalize' }}>
                        {type.name}
                    </option>
                ))}
            </select>
        </div>
    );
}