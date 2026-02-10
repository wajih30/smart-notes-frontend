import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { toast } from '../utils/toast';
import { User, Shield, Lock } from 'lucide-react';

export const SettingsPage: React.FC = () => {
    const { user } = useAuth();
    const [isUpdating, setIsUpdating] = useState(false);
    const [passwords, setPasswords] = useState({
        current_password: '',
        new_password: '',
        confirm_password: '',
    });

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.new_password !== passwords.confirm_password) {
            toast.error('New passwords do not match');
            return;
        }

        setIsUpdating(true);
        try {
            await authApi.changePassword({
                current_password: passwords.current_password,
                new_password: passwords.new_password,
            });
            toast.success('Password updated successfully');
            setPasswords({
                current_password: '',
                new_password: '',
                confirm_password: '',
            });
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to update password');
        } finally {
            setIsUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h1>
                <p className="text-gray-600">Manage your profile and security settings.</p>
            </div>

            {/* Profile Section */}
            <div className="card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                        <User size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <Input
                            value={user.full_name || 'Not provided'}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email Address
                        </label>
                        <Input
                            value={user.email}
                            disabled
                            className="bg-gray-50"
                        />
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="card">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                        <Lock size={24} />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">Security</h2>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <Input
                            type="password"
                            value={passwords.current_password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswords({ ...passwords, current_password: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <Input
                            type="password"
                            value={passwords.new_password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswords({ ...passwords, new_password: e.target.value })}
                            required
                            minLength={8}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <Input
                            type="password"
                            value={passwords.confirm_password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPasswords({ ...passwords, confirm_password: e.target.value })}
                            required
                            minLength={8}
                        />
                    </div>
                    <Button type="submit" isLoading={isUpdating}>
                        Update Password
                    </Button>
                </form>
            </div>

            {/* Account Info */}
            <div className="card border-l-4 border-primary-500">
                <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-gray-900">Account Status</h3>
                        <p className="text-gray-600 text-sm mt-1">
                            Your account is {user.status ? user.status.toLowerCase() : 'active'} and email is {user.is_email_verified ? 'verified' : 'not verified'}.
                            Member since {new Date(user.created_at).toLocaleDateString()}.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
