import React, {JSX} from 'react';

export type TypeBadgeProps = {
    type: string;
    size?: 'sm' | 'md';
}

export default function TypeBadge({ type, size = 'sm' }: TypeBadgeProps): JSX.Element {
    return (
        <span className={`type-badge type-badge--${type} ${size === 'md' ? 'type-badge--md' : ''}`}>
      {type}
    </span>
    );
}