'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { useSupabase } from '@/lib/providers/supabase-provider';
import { useKeysStore } from '@/lib/store/use-keys-store';
import { ArrowLeft } from 'lucide-react';
import type { SecurityKey, KeyType, UpdateSecurityKeyDTO } from '@/types/security-key';

export default function EditKeyPage() {
    const [key, setKey] = useState<SecurityKey | null>(null);
    const [formData, setFormData] = useState<UpdateSecurityKeyDTO>({
        id: '',
        name: '',
        type: 'password',
        description: '',
        value: '',
        url: '',
        username: '',
        tags: [],
    });
    const [tagsInput, setTagsInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { supabase } = useSupabase();
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { updateKey } = useKeysStore();
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
                setFormData({
                    id: data.id,
                    name: data.name,
                    type: data.type,
                    description: data.description || '',
                    value: data.value,
                    url: data.url || '',
                    username: data.username || '',
                    tags: data.tags || [],
                    expires_at: data.expires_at,
                });
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTypeChange = (value: KeyType) => {
        setFormData((prev) => ({ ...prev, type: value }));
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTagsInput(e.target.value);
    };

    const handleTagsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && tagsInput.trim()) {
            e.preventDefault();
            const newTag = tagsInput.trim();
            if (!formData.tags?.includes(newTag)) {
                setFormData((prev) => ({
                    ...prev,
                    tags: [...(prev.tags || []), newTag],
                }));
            }
            setTagsInput('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags?.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const { data, error } = await supabase
                .from('security_keys')
                .update({
                    name: formData.name,
                    type: formData.type,
                    description: formData.description,
                    value: formData.value,
                    url: formData.url,
                    username: formData.username,
                    tags: formData.tags,
                    expires_at: formData.expires_at,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', keyId)
                .select()
                .single();

            if (error) {
                throw error;
            }

            updateKey(data as SecurityKey);
            toast({
                title: 'Key updated',
                description: 'Your security key has been updated successfully.',
            });
            router.push(`/dashboard/keys/${keyId}`);
        } catch (error: any) {
            toast({
                title: 'Error',
                description: error.message || 'Failed to update key',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
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
            <div className="flex items-center space-x-2">
                <Button variant="outline" size="icon" onClick={() => router.push(`/dashboard/keys/${keyId}`)}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Edit Security Key</h1>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Key Details</CardTitle>
                        <CardDescription>Update the details of your security key</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" placeholder="My Password" value={formData.name} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select value={formData.type} onValueChange={handleTypeChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a key type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="password">Password</SelectItem>
                                    <SelectItem value="api_key">API Key</SelectItem>
                                    <SelectItem value="passkey">Passkey</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="A brief description of this key"
                                value={formData.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="value">Value</Label>
                            <Input id="value" name="value" type="password" placeholder="••••••••" value={formData.value} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="url">URL (Optional)</Label>
                            <Input id="url" name="url" placeholder="https://example.com" value={formData.url} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Username (Optional)</Label>
                            <Input id="username" name="username" placeholder="john.doe@example.com" value={formData.username} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags (Optional)</Label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {formData.tags?.map((tag) => (
                                    <div key={tag} className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
                                        {tag}
                                        <button
                                            type="button"
                                            className="ml-2 text-secondary-foreground/70 hover:text-secondary-foreground"
                                            onClick={() => removeTag(tag)}
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Input
                                id="tags"
                                placeholder="Add tags (press Enter to add)"
                                value={tagsInput}
                                onChange={handleTagsChange}
                                onKeyDown={handleTagsKeyDown}
                            />
                            <p className="text-xs text-muted-foreground mt-1">Press Enter to add a tag</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => router.push(`/dashboard/keys/${keyId}`)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
