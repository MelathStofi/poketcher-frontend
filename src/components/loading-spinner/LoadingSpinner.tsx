import React, {JSX} from 'react';

export default function LoadingSpinner({ text = 'Betöltés...' }: { text: string }): JSX.Element {
    return (
        <div className="loading-spinner">
            <div className="loading-spinner__wheel" />
            <p className="loading-spinner__text">{ text }</p>
        </div>
    );
}