import type React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { SupabaseProvider } from '@/lib/providers/supabase-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'SecureVault - Manage Your Security Keys',
    description: 'Securely store and manage your passkeys, passwords, API keys, and other security credentials',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={cn(inter.className, 'min-h-screen bg-background antialiased')}>
                <SupabaseProvider>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </SupabaseProvider>
            </body>
        </html>
    );
}

import './globals.css';
