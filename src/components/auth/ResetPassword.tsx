import React, { useState } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { authApi } from '../../api/auth';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { toast } from '../../utils/toast';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const token = location.state?.token || searchParams.get('token') || '';

  const [formData, setFormData] = useState({
    token: token,
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!formData.newPassword) {
      newErrors.password = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await authApi.resetPassword({
        token: formData.token,
        new_password: formData.newPassword,
      });
      toast.success('Password reset successfully! You can now log in.');
      navigate('/login');
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Password reset failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <p className="text-gray-600 mb-6">
          Enter the 6-digit verification code sent to your email and your new password.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!location.state?.token && (
            <Input
              label="Verification Code"
              type="text"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              placeholder="6-digit code"
              required
              autoComplete="one-time-code"
            />
          )}
          <Input
            label="New Password"
            type="password"
            value={formData.newPassword}
            onChange={(e) => {
              setFormData({ ...formData, newPassword: e.target.value });
              setErrors({ ...errors, password: undefined });
            }}
            error={errors.password}
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirm New Password"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              setErrors({ ...errors, confirmPassword: undefined });
            }}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Reset Password
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
