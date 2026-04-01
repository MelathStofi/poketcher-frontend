import React, { JSX } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppLayout from './components/app-layout/AppLayout';
import Home from './pages/Home';

export default function App(): JSX.Element {
    return (
        <Router>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>
            </Routes>
        </Router>
    );
}