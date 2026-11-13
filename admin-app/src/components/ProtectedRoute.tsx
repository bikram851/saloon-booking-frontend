import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSuperAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--admin-bg)',
        gap: '1rem'
      }}>
        <Loader2 size={36} color="var(--admin-blue)" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ fontSize: '0.9rem', color: 'var(--admin-secondary)', fontWeight: 600 }}>
          Authenticating Super Admin credentials...
        </span>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
