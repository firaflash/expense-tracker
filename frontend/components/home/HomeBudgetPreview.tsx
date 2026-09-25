// components/home/HomeBudgetPreview.tsx
//
// Compact budget preview for the HomeScreen.
// Shows up to 4 budgets as individual cards matching TransactionRow style.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useTheme from '../../hooks/useTheme';
import useMoniVoStore from '../../store/useMoniVoStore';

export default function HomeBudgetPreview() {
    const colors = useTheme();
    const styles = createStyles(colors);
    const navigation = useNavigation();

    const budgets = useMoniVoStore((state) => state.budgets);
    const transactions = useMoniVoStore((state) => state.transactions);
    const categories = useMoniVoStore((state) => state.categories);

    const getCategoryName = (id: string) =>
        categories.find((cat) => cat.id === id)?.name ?? 'Unknown';

    const getSpent = (categoryId: string) =>
        transactions
            .filter((tx) => tx.type === 'DEBIT' && tx.categoryId === categoryId)
            .reduce((sum, tx) => sum + tx.amount, 0);

    // Show top 4 budgets sorted by highest usage %
    const previewBudgets = budgets
        .map((b) => {
            const spent = getSpent(b.categoryId);
            const pct = b.limitAmount > 0 ? spent / b.limitAmount : 0;
            return { ...b, spent, pct, name: getCategoryName(b.categoryId) };
        })
        .sort((a, b) => b.pct - a.pct)
        .slice(0, 4);

    const getBarColor = (pct: number) => {
        if (pct >= 0.8) return colors.danger;
        if (pct >= 0.5) return '#F5A623';
        return colors.success;
    };

    if (previewBudgets.length === 0) return null;

    return (
        <View>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Budgets This Month</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Budgets' as never)}>
                    <Text style={styles.seeAll}>See all</Text>
                </TouchableOpacity>
            </View>

            {/* Individual Budget Cards */}
            {previewBudgets.map((item) => {
                const barColor = getBarColor(item.pct);
                const barWidth = Math.min(item.pct, 1) * 100;
                return (
                    <View key={item.id} style={styles.row}>
                        <View style={styles.rowTop}>
                            <Text style={styles.budgetName} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text style={[styles.budgetPct, { color: barColor }]}>
                                {Math.round(item.pct * 100)}%
                            </Text>
                        </View>

                        <View style={styles.barTrack}>
                            <View
                                style={[
                                    styles.barFill,
                                    { width: `${barWidth}%`, backgroundColor: barColor },
                                ]}
                            />
                        </View>

                        <View style={styles.rowBottom}>
                            <Text style={styles.spentText}>
                                ETB {item.spent.toLocaleString()}
                            </Text>
                            <Text style={styles.limitText}>
                                / ETB {item.limitAmount.toLocaleString()}
                            </Text>
                        </View>
                    </View>
                );
            })}
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
        row: {
            backgroundColor: colors.surface,
            borderRadius: 14,
            padding: 14,
            paddingHorizontal: 8,
            marginBottom: 5,
            gap: 8,
        },
        rowTop: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        budgetName: {
            fontSize: 15,
            fontWeight: '600',
            color: colors.textPrimary,
            flex: 1,
        },
        budgetPct: {
            fontSize: 13,
            fontWeight: '700',
        },
        barTrack: {
            height: 5,
            backgroundColor: colors.border,
            borderRadius: 3,
            overflow: 'hidden',
        },
        barFill: {
            height: '100%',
            borderRadius: 3,
        },
        rowBottom: {
            flexDirection: 'row',
            alignItems: 'baseline',
            gap: 4,
        },
        spentText: {
            fontSize: 13,
            fontWeight: '600',
            color: colors.textPrimary,
        },
        limitText: {
            fontSize: 12,
            color: colors.textSecondary,
        },
    });
