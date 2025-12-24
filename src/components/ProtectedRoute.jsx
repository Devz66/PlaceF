import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import CONFIG from '../config';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null = loading
  const location = useLocation();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Optional: Validate token with backend
        // For better performance, we might skip this on every route change if we trust localStorage
        // But for security and "refresh" requirement, we should validate.
        const response = await fetch(`${CONFIG.API_URL}/api/auth/validate`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          // Token invalid or expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Auth validation error:', error);
        // If backend is down, maybe allow if we have a token? 
        // Or fail safe. Let's fail safe for now, but maybe show a warning.
        // For this task, assuming strict validation.
        setIsAuthenticated(false);
      }
    };

    validateToken();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Verificando sessão...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to internal login route
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
