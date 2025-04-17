'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, Key, Settings, LogOut, Menu, X, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useSupabase } from '@/components/providers/supabase-provider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { theme, setTheme } = useTheme();
    const { supabase, user } = useSupabase();
    const router = useRouter();
    const { toast } = useToast();

    // Close mobile menu when path changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            toast({
                title: 'Logged out',
                description: 'You have been logged out successfully.',
            });
            router.push('/');
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'An error occurred during logout.',
                variant: 'destructive',
            });
        }
    };

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const navItems = [
        {
            name: 'Dashboard',
            href: '/dashboard',
            icon: <Shield className="h-5 w-5" />,
        },
        {
            name: 'Security Keys',
            href: '/dashboard/keys',
            icon: <Key className="h-5 w-5" />,
        },
        {
            name: 'Settings',
            href: '/dashboard/settings',
            icon: <Settings className="h-5 w-5" />,
        },
    ];

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex md:hidden">
                        <Button variant="ghost" size="icon" aria-label="Toggle Menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                    <div className="mr-4 hidden md:flex">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <Shield className="h-6 w-6" />
                            <span className="font-bold">SecureVault</span>
                        </Link>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <Button variant="ghost" size="icon" onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>
            <div className="flex flex-1">
                <aside
                    className={`fixed inset-y-0 left-0 z-40 w-64 transform border-r bg-background transition-transform duration-200 ease-in-out md:translate-x-0 ${
                        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="flex h-14 items-center border-b px-4 md:hidden">
                        <Link href="/dashboard" className="flex items-center space-x-2">
                            <Shield className="h-6 w-6" />
                            <span className="font-bold">SecureVault</span>
                        </Link>
                    </div>
                    <div className="space-y-4 py-4">
                        <div className="px-4 py-2">
                            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">{user?.email}</h2>
                            <div className="space-y-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                                            pathname === item.href ? 'bg-accent text-accent-foreground' : 'transparent'
                                        }`}
                                    >
                                        {item.icon}
                                        <span className="ml-2">{item.name}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </aside>
                <main className="flex-1 md:ml-64">
                    <div className="container py-6">{children}</div>
                </main>
            </div>
        </div>
    );
}
