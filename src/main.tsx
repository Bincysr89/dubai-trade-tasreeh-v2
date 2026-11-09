import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';
import LoginPage from './pages/LoginPage';
import CustomerTypePage from './pages/CustomerTypePage';
import OtherAgentTypePage from './pages/OtherAgentTypePage';
import LandingPage from './pages/LandingPage';
import { UaePassLoginPage, UpdateProfilePage, UaePassLinkChoicePage, UaePassExistingLoginPage } from './pages/UaePassPages';
import { BuAssociationPage, CreateUserPage } from './pages/UserManagementPages';
import { RequireAuth } from './auth';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/customer-type" element={<RequireAuth><CustomerTypePage /></RequireAuth>} />
        <Route path="/other-agent-type" element={<RequireAuth><OtherAgentTypePage /></RequireAuth>} />
        <Route path="/landing/:agent" element={<RequireAuth><LandingPage /></RequireAuth>} />
        {/* UAE PASS individual sign-in → profile → basic account → BU linking / sub users */}
        <Route path="/uaepass" element={<UaePassLoginPage />} />
        <Route path="/uaepass/link" element={<RequireAuth><UaePassLinkChoicePage /></RequireAuth>} />
        <Route path="/uaepass/existing" element={<RequireAuth><UaePassExistingLoginPage /></RequireAuth>} />
        <Route path="/uaepass/profile" element={<RequireAuth><UpdateProfilePage /></RequireAuth>} />
        <Route path="/company/bu-association" element={<RequireAuth><BuAssociationPage /></RequireAuth>} />
        <Route path="/my-users/create" element={<RequireAuth><CreateUserPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
