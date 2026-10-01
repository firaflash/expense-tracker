// This is the global brain of MOvivo
// Any screen can connect here to read or update data
// and when data changes all screeen update automtically

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api from '../utils/api';

import type { Transaction } from '../types/Transaction';
import type { Category } from '../types/Category';
import type { Budget } from '../types/Budget';
import type { Wallet } from '../types/Wallet';
import type { User } from '../types/User';

import { defaultCategories } from '../constants/defaultCategories';
import { defaultWallet } from '../utils/dummyData';
import { ThemeColors } from '../constants/theme';

// 1 we define the sape of the store 
interface MoniVoStore {
    // -State (the actual data)
    user: User | null; //the logged inuser
    isLoadingAuth: boolean; // To show loading screen while checking token
    transactions: Transaction[]; // every ecen and income entry
    categories: Category[]; // user definable categories built in + user cretaed
    budgets: Budget[]; //spending limits for each category
    wallets: Wallet[];    // all wallets (cash, bank, telebirr)
    isLoadingData: boolean; // NEW: loading flag for fetching transactions/budgets

    // Action (function that change data)
    checkAuth: () => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    setUser: (user: User | null) => void;

    // NEW: Fetch from backend
    fetchTransactions: () => Promise<void>;
    fetchBudgets: () => Promise<void>;

    // CRUD — now talk to the backend
    addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    updateTransaction: (id: string, updated: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => Promise<void>;

    addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
    deleteBudget: (id: string) => Promise<void>;
    updateBudget: (id: string, updated: Partial<Omit<Budget, 'id'>>) => Promise<void>;

    addCategory: (cat: Omit<Category, 'id'>) => void;
    deleteCategory: (id: string) => void;
    addWallet: (wallet: Omit<Wallet, 'id'>) => void;
    deleteWallet: (id: string) => void;
    logOut: () => Promise<void>;

    // Getters (computed values => from the states above)
    totalBalance: () => number;
    totalIncome: () => number;
    totalExpenses: () => number;
    transactionByCategory: () => Record<string, number>;

    //  theme store
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// 2. create the store
const useMoniVoStore = create<MoniVoStore>((set, get) => ({
    user: null,
    isLoadingAuth: true,
    transactions: [],        // CHANGED: Start empty, will be filled from backend
    categories: defaultCategories,
    budgets: [],             // CHANGED: Start empty, will be filled from backend
    wallets: [defaultWallet],
    isLoadingData: false,
    theme: 'light',

    // Authentication 
    checkAuth: async () => {
        set({ isLoadingAuth: true });
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                const { data } = await api.get('/auth/me');
                set({ user: data, isLoadingAuth: false });
            } else {
                set({ isLoadingAuth: false });
            }
        } catch (error) {
            await SecureStore.deleteItemAsync('userToken');
            set({ isLoadingAuth: false });
        }
    },

    login: async (email: string, password: string) => {
        const { data } = await api.post('/auth/login', { email, password });
        await SecureStore.setItemAsync('userToken', data.token);
        set({ user: data });
    },

    register: async (name: string, email: string, password: string) => {
        const { data } = await api.post('/auth/register', { name, email, password });
        await SecureStore.setItemAsync('userToken', data.token);
        set({ user: data });
    },

    logOut: async () => {
        await SecureStore.deleteItemAsync('userToken');
        set({
            user: null,
            transactions: [],   // CHANGED: Clear to empty instead of dummy data
            budgets: [],        // CHANGED: Clear to empty instead of dummy data
        });
    },

    setUser: (user) => set({ user }),

    //  Fetch from Backend 
    fetchTransactions: async () => {
        set({ isLoadingData: true });
        try {
            const { data } = await api.get('/transactions');
            set({ transactions: data, isLoadingData: false });
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            set({ isLoadingData: false });
        }
    },

    fetchBudgets: async () => {
        try {
            const { data } = await api.get('/budgets');
            set({ budgets: data });
        } catch (error) {
            console.error('Failed to fetch budgets:', error);
        }
    },

    //  Transactions CRUD (talks to backend)
    addTransaction: async (tx) => {
        try {
            const { data } = await api.post('/transactions', tx);
            // Add the new transaction returned by the server to the front of the list
            set((state) => ({
                transactions: [data, ...state.transactions],
            }));
        } catch (error) {
            console.error('Failed to add transaction:', error);
            throw error; // Re-throw so the UI can show an error
        }
    },

    deleteTransaction: async (id) => {
        try {
            await api.delete(`/transactions/${id}`);
            // Remove from local state only after backend confirms
            set((state) => ({
                transactions: state.transactions.filter((tx) => tx.id !== id),
            }));
        } catch (error) {
            console.error('Failed to delete transaction:', error);
            throw error;
        }
    },

    updateTransaction: async (id, updated) => {
        try {
            const { data } = await api.put(`/transactions/${id}`, updated);
            // Replace the old transaction with the updated one from the server
            set((state) => ({
                transactions: state.transactions.map((tx) =>
                    tx.id === id ? data : tx
                ),
            }));
        } catch (error) {
            console.error('Failed to update transaction:', error);
            throw error;
        }
    },

    //  Budgets CRUD (talks to backend) 
    addBudget: async (budget) => {
        try {
            const { data } = await api.post('/budgets', budget);
            set((state) => ({
                budgets: [data, ...state.budgets],
            }));
        } catch (error) {
            console.error('Failed to add budget:', error);
            throw error;
        }
    },

    deleteBudget: async (id) => {
        try {
            await api.delete(`/budgets/${id}`);
            set((state) => ({
                budgets: state.budgets.filter((b) => b.id !== id),
            }));
        } catch (error) {
            console.error('Failed to delete budget:', error);
            throw error;
        }
    },

    updateBudget: async (id, updated) => {
        try {
            const { data } = await api.put(`/budgets/${id}`, updated);
            set((state) => ({
                budgets: state.budgets.map((b) =>
                    b.id === id ? data : b
                ),
            }));
        } catch (error) {
            console.error('Failed to update budget:', error);
            throw error;
        }
    },

    //  Categories & Wallets (still local for now) 
    addCategory: (cat) => set((state) => ({
        categories: [
            ...state.categories,
            {
                ...cat,
                id: `cat-custom-${Date.now()}`,
            },
        ],
    })),

    deleteCategory: (id) => set((state) => ({
        categories: state.categories.filter((c) => c.id !== id || c.isBuiltIn),
    })),

    addWallet: (wallet) => set((state) => ({
        wallets: [
            ...state.wallets,
            {
                ...wallet,
                id: `wallet-${Date.now()}`
            },
        ],
    })),

    deleteWallet: (id) => set((state) => ({
        wallets: state.wallets.filter((wallet) => wallet.id !== id),
    })),

    //  Getters
    totalIncome: () => {
        return get().transactions
            .filter((tx) => tx.type === 'CREDIT')
            .reduce((sum, tx) => sum + tx.amount, 0);
    },

    totalExpenses: () => {
        return get().transactions
            .filter((tx) => tx.type === 'DEBIT')
            .reduce((sum, tx) => sum + tx.amount, 0);
    },

    totalBalance: () => {
        return get().totalIncome() - get().totalExpenses();
    },

    transactionByCategory: () => {
        return get().transactions
            .filter((tx) => tx.type === 'DEBIT')
            .reduce((acc, tx) => {
                acc[tx.categoryId] = (acc[tx.categoryId] || 0) + tx.amount;
                return acc;
            }, {} as Record<string, number>);
    },

    toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light',
    })),
}));

export default useMoniVoStore;
