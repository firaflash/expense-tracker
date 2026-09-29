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
import { defaultWallet, dummyTransactions, dummyBudgets } from '../utils/dummyData';
import { ThemeColors } from '../constants/theme';
import { State } from 'react-native-gesture-handler';

// 1 we define the sape of the store 
interface MoniVoStore {
    // -State (the actual data)
    user: User | null; //the logged inuser
    isLoadingAuth: boolean; // NEW: To show loading screen while checking token
    transactions: Transaction[]; // every ecen and income entry (e.g., buying airtime, receiving salary)
    categories: Category[]; // user definable categories built in + user cretaed
    budgets: Budget[]; //spending limits for each category
    wallets: Wallet[];    // all wallets (cash, bank, telebirr)


    // Action (function that change data)
    checkAuth: () => Promise<void>; // NEW: Checks if user is logged in on app start
    login: (email: string, password: string) => Promise<void>; // NEW: Real login
    register: (name: string, email: string, password: string) => Promise<void>; // NEW: Real register
    setUser: (user: User | null) => void;
    addTransaction:
    (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
    // omit means a transaction bit wihtoud the id and created at fields
    // because created at and id are aout generated when adding a transaction
    deleteTransaction: (id: string) => void;
    addCategory: (cat: Omit<Category, 'id'>) => void;
    deleteCategory: (id: string) => void;
    addBudget: (budget: Omit<Budget, 'id'>) => void;
    deleteBudget: (id: string) => void;
    addWallet: (wallet: Omit<Wallet, 'id'>) => void;
    deleteWallet: (id: string) => void;
    logOut: () => Promise<void>; // UPDATED: Now async to clear token

    updateTransaction: (id: string, updated: Partial<Omit<Transaction, 'id' | 'createdAt'>>) => void;
    updateBudget: (id: string, updated: Partial<Omit<Budget, 'id'>>) => void;

    // Getters (computed values => from the states above)
    totalBalance: () => number; //all money total across all wallets
    totalIncome: () => number;
    totalExpenses: () => number;
    transactionByCategory: () => Record<string, number>;
    //  theme store

    theme: 'light' | 'dark';
    toggleTheme: () => void;

}
// 2. create the store

// create() is the Zustand funcion> It takes that recives 'set'
// set is how you update the satet - you never modify sate directly NEVER!!!!

const useMoniVoStore = create<MoniVoStore>((set, get) => ({
    user: null,
    isLoadingAuth: true, // NEW: Start loading until we check the token
    transactions: dummyTransactions,   // Start with our fake data so screens aren't empty
    categories: defaultCategories,     // Start with all the built-in categories
    budgets: dummyBudgets,
    wallets: [defaultWallet],
    theme: 'light',

    // authentication actions
    checkAuth: async () => {
        // Set loading to true while checking for existing token
        set({ isLoadingAuth: true });
        try {
            // Get saved token from secure storage
            const token = await SecureStore.getItemAsync('userToken');
            if (token) {
                // Token exists, verify it with backend
                const { data } = await api.get('/auth/me');
                set({ user: data, isLoadingAuth: false });
            } else {
                // No token, user is not logged in
                set({ isLoadingAuth: false });
            }
        } catch (error) {
            // Token is invalid or expired, clear it
            await SecureStore.deleteItemAsync('userToken');
            set({ isLoadingAuth: false });
        }
    },

    login: async (email: string, password: string) => {
        // Send credentials to backend and get user data + token
        const { data } = await api.post('/auth/login', { email, password });
        // Save the new token securely
        await SecureStore.setItemAsync('userToken', data.token);
        // Update user state
        set({ user: data });
    },

    register: async (name: string, email: string, password: string) => {
        // Send registration data to backend
        const { data } = await api.post('/auth/register', { name, email, password });
        // Save the token
        await SecureStore.setItemAsync('userToken', data.token);
        // Update user state
        set({ user: data });
    },

    logOut: async () => {
        // Remove token from secure storage
        await SecureStore.deleteItemAsync('userToken');
        // Clear user and reset app data
        set({
            user: null,
            transactions: dummyTransactions,
            budgets: dummyBudgets,
        });
    },

    // Actions Implementaions
    setUser: (user) => set({ user }),
    // set ({user}) replaces the `user` field in the store with the new value
    // this is zustand's way - you call set() with the new values


    addTransaction: (tx) => set((state) => ({
        // We spread all old transactions and add the new one at the front
        transactions: [
            {
                ...tx,                            // Copy all fields the caller provided
                id: `tx-${Date.now()}`,           // Auto-generate a unique ID using timestamp
                createdAt: new Date().toISOString(), // Auto-set creation time
            },
            ...state.transactions,             // Keep all existing transactions after it
        ],
    })),
    deleteTransaction: (id) => set((state) => ({
        // filter() keeps only transactions where the id does NOT match
        transactions: state.transactions.filter((tx) => tx.id !== id),
    })),
    addCategory: (cat) => set((state) => ({
        categories: [
            ...state.categories,
            {
                ...cat,
                id: `cat-custom-${Date.now()}`, // Custom categories get a unique ID
            },
        ],
    })),

    deleteCategory: (id) => set((state) => ({
        // Only allow deleting non-built-in categories
        categories: state.categories.filter((c) => c.id !== id || c.isBuiltIn),
    })),

    addBudget: (budget) => set((state) => ({
        budgets: [
            ...state.budgets,
            {
                ...budget,
                id: `budget-${Date.now()}`, // Auto-generate ID for new budget
            },
        ],
    })),
    deleteBudget: (id) => set((state) => ({
        budgets: state.budgets.filter((b) => b.id !== id),
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

    updateTransaction: (id, updated) => set((state) => ({
        transactions: state.transactions.map((tx) =>
            tx.id === id ? { ...tx, ...updated } : tx
        ),
    })),

    updateBudget: (id, updated) => set((state) => ({
        budgets: state.budgets.map((b) =>
            b.id === id ? { ...b, ...updated } : b
        ),
    })),


    // Getter implenataions
    // get() gives us access to the current state inside these functions
    totalIncome: () => {
        // Sum up all CREDIT transactions
        return get().transactions
            .filter((tx) => tx.type === 'CREDIT')
            .reduce((sum, tx) => sum + tx.amount, 0);
        // redunce() walkd through the array abd accunaktes a tota 
        // starts at 0, adds each tx.amount one by one
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