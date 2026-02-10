import React from 'react';
import { ForgotPassword } from '../components/auth/ForgotPassword';

export const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <ForgotPassword />
    </div>
  );
};
