import React from 'react';
import { VerifyOTP } from '../components/auth/VerifyOTP';

export const VerifyOTPPage: React.FC = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50 px-4">
            <VerifyOTP />
        </div>
    );
};
