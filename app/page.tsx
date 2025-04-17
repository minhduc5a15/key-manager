import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Key, Lock, Database } from 'lucide-react';

export default function Home() {
    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 flex">
                        <Link href="/" className="flex items-center space-x-2">
                            <Shield className="h-6 w-6" />
                            <span className="font-bold">SecureVault</span>
                        </Link>
                    </div>
                    <div className="flex flex-1 items-center justify-end space-x-4">
                        <nav className="flex items-center space-x-2">
                            <Link href="/auth/login">
                                <Button variant="ghost">Login</Button>
                            </Link>
                            <Link href="/auth/signup">
                                <Button>Sign Up</Button>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex-1">
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Secure Your Digital Keys in One Place</h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Store and manage all your passkeys, passwords, API keys, and other security credentials securely.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link href="/auth/signup">
                                        <Button size="lg" className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                    <Link href="/auth/login">
                                        <Button size="lg" variant="outline" className="w-full">
                                            Login
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <div className="grid grid-cols-2 gap-4 md:gap-8">
                                    <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                                        <Key className="h-8 w-8 text-primary" />
                                        <h3 className="text-xl font-bold">Passkeys</h3>
                                        <p className="text-center text-muted-foreground">Store your passkeys securely with end-to-end encryption.</p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                                        <Lock className="h-8 w-8 text-primary" />
                                        <h3 className="text-xl font-bold">Passwords</h3>
                                        <p className="text-center text-muted-foreground">Keep your passwords organized and secure.</p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                                        <Database className="h-8 w-8 text-primary" />
                                        <h3 className="text-xl font-bold">API Keys</h3>
                                        <p className="text-center text-muted-foreground">Manage your API keys with proper access controls.</p>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                                        <Shield className="h-8 w-8 text-primary" />
                                        <h3 className="text-xl font-bold">Security</h3>
                                        <p className="text-center text-muted-foreground">Advanced encryption and security measures.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="border-t py-6 md:py-0">
                <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
                    <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">© 2024 SecureVault. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
