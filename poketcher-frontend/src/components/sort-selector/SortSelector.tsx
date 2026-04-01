import React, { JSX } from 'react';

export type SortOption = 'id-asc' | 'id-desc' | 'name-asc' | 'name-desc';

export type SortSelectorProps = {
    selectedSort: SortOption;
    onSortChange: (value: SortOption) => void;
    isLoading?: boolean;
};

const sortOptions: Array<{ value: SortOption; label: string }> = [
    { value: 'id-asc', label: 'ID növekvő' },
    { value: 'id-desc', label: 'ID csökkenő' },
    { value: 'name-asc', label: 'Név A-Z' },
    { value: 'name-desc', label: 'Név Z-A' },
];

export default function SortSelector({
                                         selectedSort,
                                         onSortChange,
                                         isLoading = false,
                                     }: SortSelectorProps): JSX.Element {
    return (
        <div className="sort-selector">
            <select
                className="sort-selector__select"
                value={selectedSort}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>): void =>
                    onSortChange(e.target.value as SortOption)
                }
                disabled={isLoading}
            >
                {sortOptions.map((option: { value: SortOption; label: string }): JSX.Element => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}