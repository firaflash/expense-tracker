// components/modals/EditBudgetModal.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform, Pressable, } from 'react-native';

import useTheme from '../../hooks/useTheme';
import useMoniVoStore from '../../store/useMoniVoStore';
import { Budget } from '../../types/Budget';

import CloseButton from '../common/buttons/CloseButton';
import AmountInput from '../common/inputs/AmountInput';
import CategoryPicker from '../common/selectors/CategoryPicker';
import PeriodSelector from '../common/selectors/PeriodSelector';
import PrimaryButton from '../common/buttons/PrimaryButton';

interface EditBudgetModalProps {
    visible: boolean;
    budget: Budget | null;
    onClose: () => void;
}

type BudgetPeriod = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom';

export default function EditBudgetModal({
    visible,
    budget,
    onClose,
}: EditBudgetModalProps) {
    const colors = useTheme();
    const styles = createStyles(colors);

    const categories = useMoniVoStore((state) => state.categories);
    const budgets = useMoniVoStore((state) => state.budgets);
    const updateBudget = useMoniVoStore((state) => state.updateBudget);

    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [limitAmount, setLimitAmount] = useState('');
    const [period, setPeriod] = useState<BudgetPeriod>('monthly');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (budget) {
            setSelectedCategoryId(budget.categoryId);
            setLimitAmount(budget.limitAmount.toString());
            const p = budget.recurring === 'none' ? 'custom' : (budget.recurring as BudgetPeriod);
            setPeriod(p || 'monthly');
            setStartDate(budget.startDate);
            setEndDate(budget.endDate);
        }
    }, [budget, visible]);

    const recurring = period === 'custom' ? 'none' : period;

    // Available categories: include the current budget's category + any unused expense categories
    const availableCategories = categories.filter((cat) => {
        if (cat.flow !== 'EXPENSE') return false;
        if (budget && cat.id === budget.categoryId) return true;
        return !budgets.some((b) => b.categoryId === cat.id);
    });

    const handleSubmit = () => {
        if (!budget) return;
        const numAmount = parseFloat(limitAmount);

        if (isNaN(numAmount) || numAmount <= 0) {
            alert('Please enter a valid budget amount');
            return;
        }
        if (!selectedCategoryId) {
            alert('Please select a category');
            return;
        }
        if (endDate < startDate) {
            alert('End date cannot be before start date');
            return;
        }

        updateBudget(budget.id, {
            categoryId: selectedCategoryId,
            limitAmount: numAmount,
            recurring: recurring,
            startDate,
            endDate,
        });

        onClose();
    };

    if (!budget) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
            statusBarTranslucent
        >
            <View style={styles.modalRoot}>
                <Pressable style={styles.backdrop} onPress={onClose} />
                <KeyboardAvoidingView
                    style={styles.keyboardLayer}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    <View style={styles.container}>
                        {/* HEADER */}
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.headerEyebrow}>EDIT BUDGET</Text>
                                <Text style={styles.headerTitle}>Update Spending Limit</Text>
                            </View>
                            <CloseButton onPress={onClose} />
                        </View>

                        {/* FORM */}
                        <ScrollView
                            contentContainerStyle={styles.form}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {/* CATEGORY PICKER */}
                            <CategoryPicker
                                categories={availableCategories}
                                selectedId={selectedCategoryId}
                                onSelect={setSelectedCategoryId}
                            />

                            {/* AMOUNT INPUT */}
                            <View style={styles.inputSection}>
                                <Text style={styles.inputLabel}>BUDGET LIMIT</Text>
                                <AmountInput
                                    value={limitAmount}
                                    onChangeText={setLimitAmount}
                                    variant="compact"
                                />
                            </View>

                            {/* PERIOD SELECTOR */}
                            <PeriodSelector
                                period={period}
                                startDate={startDate}
                                endDate={endDate}
                                onPeriodChange={setPeriod}
                                onStartDateChange={setStartDate}
                                onEndDateChange={setEndDate}
                            />

                            {/* SUBMIT BUTTON */}
                            <View style={styles.footer}>
                                <PrimaryButton
                                    label="Save Changes"
                                    onPress={handleSubmit}
                                />
                            </View>
                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );
}

const createStyles = (colors: ReturnType<typeof useTheme>) =>
    StyleSheet.create({
        modalRoot: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        backdrop: {
            ...StyleSheet.absoluteFill,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
        },

        keyboardLayer: {
            justifyContent: 'flex-end',
        },
        container: {
            backgroundColor: colors.background,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            borderWidth: 1,
            borderColor: colors.border,
            maxHeight: '90%',
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
        },
        headerEyebrow: {
            fontSize: 11,
            fontWeight: '700',
            letterSpacing: 1.5,
            color: colors.champagne,
            marginBottom: 2,
        },
        headerTitle: {
            fontSize: 18,
            fontWeight: '700',
            color: colors.textPrimary,
        },
        form: {
            padding: 20,
            gap: 16,
        },
        footer: {
            marginTop: 10,
            marginBottom: 24,
        },
        inputSection: {
            gap: 6,
        },
        inputLabel: {
            fontSize: 12,
            fontWeight: '600',
            color: colors.textSecondary,
            letterSpacing: 0.5,
        },
    });
