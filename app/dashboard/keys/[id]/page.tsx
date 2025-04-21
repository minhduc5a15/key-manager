'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { Lock, Database, Shield, Key, ArrowLeft, Edit, Trash2, Copy, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import type { SecurityKey, KeyType } from '@/types/security-key';
import { useKeysStore } from '@/lib/store/use-keys-store';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function KeyDetailsPage() {
    const [key, setKey] = useState<SecurityKey | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showValue, setShowValue] = useState(false);
    const { supabase } = useSupabase();
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { deleteKey } = useKeysStore();
    const keyId = params.id as string;

    useEffect(() => {
        const fetchKey = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase.from('security_keys').select('*').eq('id', keyId).single();

                if (error) {
                    throw error;
                }

                setKey(data as SecurityKey);
            } catch (error: any) {
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to fetch key details',
                    variant: 'destructive',
                });
                router.push('/dashboard/keys');
            } finally {
                setIsLoading(false);
            }
        };

        if (keyId) {
            fetchKey();
        }
    }, [keyId, supabase, toast, router]);

    const handleDelete = async () => {
        try {
            const { error } = await supabase.from('security_keys').delete().eq('id', keyId);

            if (error) {
                throw error;
            }

            deleteKey(keyId);
            toast({
                title: 'Key deleted',
                description: 'The security key has been deleted successfully.',
            });
            router.push('/dashboard/keys');
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete key',
                variant: 'destructive',
            });
        }
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copied to clipboard',
            description: `${label} has been copied to your clipboard.`,
        });
    };

    const getKeyIcon = (type: KeyType) => {
        switch (type) {
            case 'password':
                return <Lock className="h-6 w-6" />;
            case 'api_key':
                return <Database className="h-6 w-6" />;
            case 'passkey':
                return <Shield className="h-6 w-6" />;
            default:
                return <Key className="h-6 w-6" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-8">
                <p>Loading key details...</p>
            </div>
        );
    }

    if (!key) {
        return (
            <div className="flex justify-center py-8">
                <p>Key not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon" onClick={() => router.push('/dashboard/keys')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">Key Details</h1>
                </div>
                <div className="flex space-x-2">
                    <Link href={`/dashboard/keys/${keyId}/edit`}>
                        <Button variant="outline">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Button>
                    </Link>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete the security key.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center space-x-2">
                        <Badge variant="outline">{key.type}</Badge>
                        {key.expires_at && (
                            <Badge variant={new Date(key.expires_at) < new Date() ? 'destructive' : 'secondary'}>
                                {new Date(key.expires_at) < new Date() ? 'Expired' : 'Expires'}: {new Date(key.expires_at).toLocaleDateString()}
                            </Badge>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">{getKeyIcon(key.type)}</span>
                        <CardTitle className="text-2xl">{key.name}</CardTitle>
                    </div>
                    <CardDescription>{key.description || 'No description'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium">Value</h3>
                            <div className="flex space-x-2">
                                <Button variant="ghost" size="icon" onClick={() => setShowValue(!showValue)} title={showValue ? 'Hide value' : 'Show value'}>
                                    {showValue ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(key.value, 'Value')} title="Copy to clipboard">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        <div className="rounded-md bg-muted p-3 font-mono text-sm">{showValue ? key.value : '••••••••••••••••••••••••••••••'}</div>
                    </div>

                    {key.username && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">Username</h3>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(key.username!, 'Username')} title="Copy to clipboard">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="rounded-md bg-muted p-3 font-mono text-sm">{key.username}</div>
                        </div>
                    )}

                    {key.url && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium">URL</h3>
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(key.url!, 'URL')} title="Copy to clipboard">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="rounded-md bg-muted p-3 font-mono text-sm break-all">
                                <a href={key.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                    {key.url}
                                </a>
                            </div>
                        </div>
                    )}

                    {key.tags && key.tags.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="text-sm font-medium">Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {key.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-2">
                    <div className="text-sm text-muted-foreground">Created: {new Date(key.created_at).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Last updated: {new Date(key.updated_at).toLocaleString()}</div>
                </CardFooter>
            </Card>
        </div>
    );
}
