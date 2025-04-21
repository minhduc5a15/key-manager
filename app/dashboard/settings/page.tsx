'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { useTheme } from 'next-themes';

export default function SettingsPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const { supabase, user } = useSupabase();
    const { toast } = useToast();
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();

                if (error) {
                    throw error;
                }

                if (data) {
                    setFullName(data.full_name || '');
                    setEmail(user.email || '');
                }
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to fetch profile',
                    variant: 'destructive',
                });
            }
        };

        fetchProfile();
    }, [supabase, user, toast]);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: fullName,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user?.id);

            if (error) {
                throw error;
            }

            toast({
                title: 'Profile updated',
                description: 'Your profile has been updated successfully.',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update profile',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingPassword(true);

        if (newPassword !== confirmPassword) {
            toast({
                title: 'Error',
                description: 'New passwords do not match',
                variant: 'destructive',
            });
            setIsUpdatingPassword(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                throw error;
            }

            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');

            toast({
                title: 'Password updated',
                description: 'Your password has been updated successfully.',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update password',
                variant: 'destructive',
            });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account settings and preferences</p>
            </div>
            <div className="grid gap-6">
                <Card>
                    <form onSubmit={handleUpdateProfile}>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                            <CardDescription>Update your personal information</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="full-name">Full Name</Label>
                                <Input id="full-name" placeholder="John Doe" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} disabled />
                                <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
                <Card>
                    <form onSubmit={handleUpdatePassword}>
                        <CardHeader>
                            <CardTitle>Password</CardTitle>
                            <CardDescription>Update your password</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Confirm New Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={8}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isUpdatingPassword}>
                                {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance</CardTitle>
                        <CardDescription>Customize the appearance of the application</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label htmlFor="dark-mode">Dark Mode</Label>
                                <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
                            </div>
                            <Switch id="dark-mode" checked={theme === 'dark'} onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
