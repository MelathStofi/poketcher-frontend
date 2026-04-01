import React, { JSX } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import { AuthProvider, useAuth } from './context/authContext';
import AuthPage from './pages/AuthPage';
import Home from './pages/Home';
import PokemonDetailsPage from './pages/PokemonDetails';

function ProtectedRoute({ children }: { children: JSX.Element }): JSX.Element {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

function AppRoutes(): JSX.Element {
    return (
        <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/pokemon/:nameOrId" element={<PokemonDetailsPage />} />
            </Route>
        </Routes>
    );
}

export default function App(): JSX.Element {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}