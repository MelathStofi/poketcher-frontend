import React, {JSX} from 'react';
import { Link } from 'react-router-dom';

export default function Navbar(): JSX.Element {
    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <Link to="/" className="navbar__brand">
                    <div className="navbar__brand-icon"><img src="/pokeball.png" alt="Pokétcher logo" /></div>
                    Pokétcher
                </Link>
            </div>
        </nav>
    );
}