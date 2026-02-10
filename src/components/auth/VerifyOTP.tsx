import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from '../../utils/toast';

export const VerifyOTP: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            toast.error('Please enter a 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            await authApi.verifyResetCode(otp);
            toast.success('Verification successful!');
            navigate('/reset-password', { state: { token: otp } });
        } catch (err: any) {
            const message = err.response?.data?.detail || 'Invalid verification code';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (!email) {
            toast.error('Email is missing. Please go back and try again.');
            return;
        }

        setIsResending(true);
        try {
            await authApi.forgotPassword({ email });
            toast.success('Verification code resent!');
        } catch (err: any) {
            const message = err.response?.data?.detail || 'Failed to resend code';
            toast.error(message);
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            <div className="card text-center">
                <h2 className="text-2xl font-bold mb-4">Verify Code</h2>
                <p className="text-gray-600 mb-6">
                    Enter the 6-digit code sent to <strong>{email || 'your email'}</strong>
                </p>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Verification Code"
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="text-center text-2xl tracking-[1em]"
                        required
                        autoComplete="one-time-code"
                    />
                    <div className="space-y-3">
                        <Button type="submit" className="w-full" isLoading={isLoading}>
                            Verify & Continue
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            onClick={handleResend}
                            isLoading={isResending}
                        >
                            Resend Code
                        </Button>
                    </div>
                    <div className="mt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                            Back to Email Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
