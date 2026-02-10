import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Sparkles } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/notes" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-200">
            <Sparkles size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Create Account</h1>
          <p className="text-gray-500 font-medium">Join Smart Notes and boost your productivity</p>
        </div>

        <div className="card-premium p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Sign Up</h2>
            <p className="text-sm text-gray-500 mt-1">Get started with your free account today</p>
          </div>
          <RegisterForm />
        </div>

        <p className="text-center mt-8 text-sm text-gray-400 font-medium">
          Start building your knowledge base.
        </p>
      </div>
    </div>
  );
};
