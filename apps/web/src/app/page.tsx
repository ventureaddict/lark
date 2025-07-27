'use client';

import { useState, useEffect } from 'react';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { DemoMode } from '@/components/DemoMode';
import { api } from '@/lib/api';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.setToken(token);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleAuthSuccess = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    api.clearToken();
    setIsAuthenticated(false);
  };

  const handleDemoMode = () => {
    setIsAuthenticated(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Lark...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <ChatInterface onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100"></div>
      
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {isLogin ? (
              <LoginForm
                onSuccess={handleAuthSuccess}
                onToggleMode={() => setIsLogin(false)}
              />
            ) : (
              <RegisterForm
                onSuccess={handleAuthSuccess}
                onToggleMode={() => setIsLogin(true)}
              />
            )}

            <DemoMode onEnterDemo={handleDemoMode} />
          </div>
          
          {/* Demo notice */}
          <div className="mt-6 text-center">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Demo Mode:</strong> The database is currently experiencing issues on Railway. 
                You can explore the chat interface, but registration/login may not work yet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
