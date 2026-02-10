import React from 'react';
import { ResetPassword } from '../components/auth/ResetPassword';

export const ResetPasswordPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
      <ResetPassword />
    </div>
  );
};
