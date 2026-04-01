import React, { JSX } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../service/auth/authService';
import { useAuth } from '../context/authContext';

export default function Navbar(): JSX.Element {
    const navigate = useNavigate();
    const { logoutSuccess } = useAuth();

    const handleLogout = async (): Promise<void> => {
        try {
            await logout();
        } finally {
            logoutSuccess();
            navigate('/auth');
        }
    };

    return (
        <nav className="navbar">
            <div className="navbar__inner">
                <Link to="/" className="navbar__brand">
                    <div className="navbar__brand-icon">
                        <img src="/pokeball.png" alt="Pokétcher logo" />
                    </div>
                    Pokétcher
                </Link>

                <button type="button" className="navbar__logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </nav>
    );
}