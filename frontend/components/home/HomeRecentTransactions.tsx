// components/home/HomeRecentTransactions.tsx
//
// Self-contained "Recent Transactions" section for the HomeScreen.
// Pulls its own data from the store, shows the last 7 transactions.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../hooks/useTheme';
import useMoniVoStore from '../../store/useMoniVoStore';
import TransactionRow from './TransactionRow';

export default function HomeRecentTransactions() {
    const colors = useTheme();
    const styles = createStyles(colors);
    const navigation = useNavigation();

    const transactions = useMoniVoStore((state) => state.transactions);
    const categories = useMoniVoStore((state) => state.categories);

    const recentTransactions = transactions.slice(0, 7);

    const getCategoryById = (id: string) =>
        categories.find((cat) => cat.id === id);

    return (
        <View>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Transactions</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Transactions' as never)}>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            </View>

            {/* Transaction List */}
            {recentTransactions.length === 0 ? (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyIcon}>💳</Text>
                    <Text style={styles.emptyTitle}>No transactions yet</Text>
                    <Text style={styles.emptySubtitle}>
                        Tap "Add Expense" to log your first one
                    </Text>
                </View>
            ) : (
                recentTransactions.map((transaction) => (
                    <TransactionRow
                        key={transaction.id}
                        transaction={transaction}
                        category={getCategoryById(transaction.categoryId)}
                        onPress={() => console.log('Tapped:', transaction.id)}
                    />
                ))
            )}
        </View>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        sectionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: colors.textPrimary,
        },
        seeAll: {
            fontSize: 14,
            color: colors.champagne,
            fontWeight: '500',
        },
        emptyState: {
            alignItems: 'center',
            paddingVertical: 40,
            gap: 8,
        },
        emptyIcon: {
            fontSize: 48,
            marginBottom: 8,
        },
        emptyTitle: {
            fontSize: 16,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        emptySubtitle: {
            fontSize: 14,
            color: colors.textSecondary,
            textAlign: 'center',
        },
    });
