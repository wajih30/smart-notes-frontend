import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from '../../utils/toast';
import { Sparkles } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as any)?.email || '';
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter a 6-digit verification code');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await authApi.verifyEmail({ token: otp });
      toast.success('Email verified successfully! You can now log in.');
      navigate('/login');
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Verification failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error('Email not found. Please register again.');
      return;
    }

    try {
      await authApi.resendVerification({ email });
      toast.success('Verification code sent');
    } catch (err: any) {
      toast.error('Failed to resend verification code');
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-primary-200">
          <Sparkles size={32} className="text-white" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Verify Email</h1>
        <p className="text-gray-500 font-medium">Protecting your digital second brain</p>
      </div>

      <div className="card-premium p-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900">Email Verification</h2>
          <p className="text-sm text-gray-500 mt-1">
            We've sent a code to <span className="font-bold text-gray-900">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Verification Code"
            type="text"
            value={otp}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setOtp(value);
              setError('');
            }}
            placeholder="000000"
            maxLength={6}
            error={error}
            required
            className="text-center"
          />

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Confirm Code
          </Button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={handleResend}
              className="text-[13px] font-bold text-primary-600 hover:text-primary-700 transition-colors uppercase tracking-tight"
            >
              Resend verification code
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
