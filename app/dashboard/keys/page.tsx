'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Search, Key, Lock, Database, Shield, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/lib/providers/supabase-provider';
import type { SecurityKey, KeyType } from '@/types/security-key';
import { useKeysStore } from '@/lib/store/use-keys-store';

export default function KeysPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { supabase } = useSupabase();
    const router = useRouter();
    const { toast } = useToast();
    const { keys, setKeys, deleteKey, setLoading, isLoading, error, setError } = useKeysStore();

    useEffect(() => {
        const fetchKeys = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from('security_keys').select('*').order('created_at', { ascending: false });

                if (error) {
                    throw error;
                }

                setKeys(data as SecurityKey[]);
            } catch (error: any) {
                setError(error.message);
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to fetch keys',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchKeys();
    }, [supabase, setKeys, setLoading, setError, toast]);

    const handleDelete = async (id: string) => {
        try {
            const { error } = await supabase.from('security_keys').delete().eq('id', id);

            if (error) {
                throw error;
            }

            deleteKey(id);
            toast({
                title: 'Key deleted',
                description: 'The security key has been deleted successfully.',
            });
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete key',
                variant: 'destructive',
            });
        }
    };

    const filteredKeys = keys.filter(
        (key) =>
            key.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            key.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            key.type.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    const getKeyIcon = (type: KeyType) => {
        switch (type) {
            case 'password':
                return <Lock className="h-5 w-5" />;
            case 'api_key':
                return <Database className="h-5 w-5" />;
            case 'passkey':
                return <Shield className="h-5 w-5" />;
            default:
                return <Key className="h-5 w-5" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Security Keys</h1>
                    <p className="text-muted-foreground">Manage your passwords, API keys, and other security credentials</p>
                </div>
                <Link href="/dashboard/keys/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Key
                    </Button>
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search keys..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
            </div>
            {isLoading ? (
                <div className="flex justify-center py-8">
                    <p>Loading keys...</p>
                </div>
            ) : error ? (
                <div className="flex justify-center py-8">
                    <p className="text-destructive">{error}</p>
                </div>
            ) : filteredKeys.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Key className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">No keys found</h3>
                        <p className="text-sm text-muted-foreground text-center max-w-md mt-2">
                            {searchTerm
                                ? `No keys match your search "${searchTerm}". Try a different search term.`
                                : "You haven't added any security keys yet. Click 'Add New Key' to get started."}
                        </p>
                        {searchTerm ? (
                            <Button variant="outline" className="mt-4" onClick={() => setSearchTerm('')}>
                                Clear search
                            </Button>
                        ) : (
                            <Link href="/dashboard/keys/new">
                                <Button className="mt-4">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add New Key
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredKeys.map((key) => (
                        <Card key={key.id}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                    <Badge variant="outline" className="mb-2">
                                        {key.type}
                                    </Badge>
                                    <div className="flex items-center space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/keys/${key.id}`)}>
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/keys/${key.id}/edit`)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => handleDelete(key.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <CardTitle className="flex items-center">
                                    <span className="mr-2">{getKeyIcon(key.type)}</span>
                                    {key.name}
                                </CardTitle>
                                <CardDescription>{key.description || 'No description'}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-2">
                                {key.url && (
                                    <p className="text-sm truncate">
                                        <span className="font-medium">URL:</span> {key.url}
                                    </p>
                                )}
                                {key.username && (
                                    <p className="text-sm truncate">
                                        <span className="font-medium">Username:</span> {key.username}
                                    </p>
                                )}
                                {key.tags && key.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {key.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="text-xs">
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="pt-2">
                                <p className="text-xs text-muted-foreground">Created: {new Date(key.created_at).toLocaleDateString()}</p>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
