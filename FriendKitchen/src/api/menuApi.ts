import { API_BASE_URL } from './config';

export type Product = {
    id: number | string;
    name: string;
    weight?: number;
    price: number;
    category?: string;
};

export const menuApi = {
    getAll: async (): Promise<Product[]> => {
        const response = await fetch(`${API_BASE_URL}/menu`);
        if (!response.ok) throw new Error('Failed to fetch menu');
        return response.json();
    },

    update: async (id: number | string, data: Partial<Product>): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to update item');
    },

    delete: async (id: number | string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/menu/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete item');
    },

    create: async (data: Omit<Product, 'id'>): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/menu`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error('Failed to add item');
    }
};
