export type KeyType = 'password' | 'api_key' | 'passkey' | 'other';

export interface SecurityKey {
    id: string;
    user_id: string;
    name: string;
    type: KeyType;
    description?: string;
    value: string;
    url?: string;
    username?: string;
    tags?: string[];
    expires_at?: string;
    created_at: string;
    updated_at: string;
}

export interface CreateSecurityKeyDTO {
    name: string;
    type: KeyType;
    description?: string;
    value: string;
    url?: string;
    username?: string;
    tags?: string[];
    expires_at?: string;
}

export interface UpdateSecurityKeyDTO extends Partial<CreateSecurityKeyDTO> {
    id: string;
}
