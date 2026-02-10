import React from 'react';
import { VerifyEmail } from '../components/auth/VerifyEmail';

export const VerifyEmailPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <VerifyEmail />
      </div>
    </div>
  );
};
