import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from '../../utils/toast';

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await authApi.forgotPassword({ email });
      setIsSubmitted(true);
      toast.success('If email exists, verification code will be sent');
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Failed to send reset code';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card text-center">
          <div className="mb-4 flex justify-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
          <p className="text-gray-600 mb-6">
            We've sent a 6-digit verification code to <strong>{email}</strong>. Use this code to reset your password.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate('/verify-otp', { state: { email } })}
              className="w-full"
            >
              Enter Verification Code
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsSubmitted(false);
                setEmail('');
              }}
              className="w-full"
            >
              Try Another Email
            </Button>
          </div>
          <div className="mt-6">
            <button
              onClick={() => navigate('/login')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
        <p className="text-gray-600 mb-6">
          Enter your email address and we'll send you a verification code to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            error={error}
            required
            autoComplete="email"
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Send Reset Code
          </Button>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full text-center text-primary-600 hover:text-primary-700 font-medium"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
