import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/UI';
import NodeGraph from './components/NodeGraph';
import PageTransitionGrid from './components/PageTransitionGrid';
import { api } from './api';
import './theme.css';

// 5 Page Imports (Exact 1 file per page)
import LoginPage from './pages/LoginPage';
import FraudCheckPage from './pages/FraudCheckPage';
import RiskResultPage from './pages/RiskResultPage';
import ComplaintsDashboard from './pages/ComplaintsDashboard';
import ComplaintDetailPage from './pages/ComplaintDetailPage';

/**
 * Role-Based Route Guard Wrapper
 */
function ProtectedRoute({ user, requiredRole, children }) {
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'officer' ? '/complaints' : '/check'} replace />;
  }
  return children;
}

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => api.getCurrentUser());
  const [lastCheckResult, setLastCheckResult] = useState(null);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    api.logout();
    setCurrentUser(null);
    window.location.href = '/';
  };

  const isLoggedIn = !!currentUser;

  return (
    <BrowserRouter>
      <PageTransitionGrid rows={10} cols={16}>
        <div className="app-shell">
          {/* Full-Screen Bluish-Green Background Node Graph for Post-Login Pages */}
          {isLoggedIn && <NodeGraph theme="bluish-green" fullscreen />}

          {/* Global Glassmorphism Header — hidden on login for full-screen split layout */}
          {isLoggedIn && <Header user={currentUser} onLogout={handleLogout} />}

        {/* Routed Pages */}
        <main style={{ flex: 1 }}>
          <Routes>
            {/* 1. Login Page (Public / Auth landing) */}
            <Route
              path="/"
              element={
                currentUser ? (
                  <Navigate to={currentUser.role === 'officer' ? '/complaints' : '/check'} replace />
                ) : (
                  <LoginPage onLoginSuccess={handleLoginSuccess} />
                )
              }
            />

            {/* 2. Customer: Fraud Check Page */}
            <Route
              path="/check"
              element={
                <ProtectedRoute user={currentUser} requiredRole="customer">
                  <FraudCheckPage onCheckComplete={setLastCheckResult} />
                </ProtectedRoute>
              }
            />

            {/* 3. Customer: Risk Result Page */}
            <Route
              path="/result"
              element={
                <ProtectedRoute user={currentUser} requiredRole="customer">
                  <RiskResultPage resultData={lastCheckResult} />
                </ProtectedRoute>
              }
            />

            {/* 4. Bank Officer: Complaints Dashboard */}
            <Route
              path="/complaints"
              element={
                <ProtectedRoute user={currentUser} requiredRole="officer">
                  <ComplaintsDashboard />
                </ProtectedRoute>
              }
            />

            {/* 5. Bank Officer: Complaint Detail Page */}
            <Route
              path="/complaints/:id"
              element={
                <ProtectedRoute user={currentUser} requiredRole="officer">
                  <ComplaintDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Catch-all fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
      </PageTransitionGrid>
    </BrowserRouter>
  );
}
