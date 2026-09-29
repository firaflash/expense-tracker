// components/modals/EditTransactionModal.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, KeyboardAvoidingView, Platform, Pressable, } from 'react-native';

import { Transaction } from '../../types/Transaction';
import useMoniVoStore from '../../store/useMoniVoStore';
import useTheme from '../../hooks/useTheme';

import CloseButton from '../common/buttons/CloseButton';
import AmountInput from '../common/inputs/AmountInput';
import CategoryPicker from '../common/selectors/CategoryPicker';
import NoteInput from '../common/inputs/NoteInput';
import PrimaryButton from '../common/buttons/PrimaryButton';

interface EditTransactionModalProps {
    visible: boolean;
    transaction: Transaction | null;
    onClose: () => void;
}

export default function EditTransactionModal({
    visible,
    transaction,
    onClose,
}: EditTransactionModalProps) {
    const colors = useTheme();
    const styles = createStyles(colors);

    const categories = useMoniVoStore((state) => state.categories);
    const updateTransaction = useMoniVoStore((state) => state.updateTransaction);

    const [type, setType] = useState<'CREDIT' | 'DEBIT'>('DEBIT');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

    useEffect(() => {
        if (transaction) {
            setType(transaction.type);
            setAmount(transaction.amount.toString());
            setNote(transaction.note || '');
            setSelectedCategoryId(transaction.categoryId);
        }
    }, [transaction, visible]);

    const filteredCategories = categories.filter((category) =>
        type === 'DEBIT'
            ? category.flow === 'EXPENSE'
            : category.flow === 'INCOME'
    );

    const handleSubmit = () => {
        if (!transaction) return;
        const numAmount = parseFloat(amount);

        if (isNaN(numAmount) || numAmount <= 0 || !amount.trim()) {
            alert('Please enter a valid amount');
            return;
        }
        if (!selectedCategoryId) {
            alert('Please select a category');
            return;
        }

        updateTransaction(transaction.id, {
            type,
            amount: numAmount,
            categoryId: selectedCategoryId,
            note: note.trim() || undefined,
        });

        onClose();
    };

    if (!transaction) return null;

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
                                <Text style={styles.headerEyebrow}>EDIT RECORD</Text>
                                <Text style={styles.headerTitle}>Update Transaction</Text>
                            </View>
                            <CloseButton onPress={onClose} />
                        </View>

                        {/* FORM */}
                        <ScrollView
                            contentContainerStyle={styles.form}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {/* TYPE TOGGLE (Income / Expense) */}
                            <View style={styles.typeSelector}>
                                <TouchableOpacity
                                    style={[styles.typeButton, type === 'DEBIT' && styles.typeButtonActiveDebit]}
                                    onPress={() => {
                                        setType('DEBIT');
                                        setSelectedCategoryId('');
                                    }}
                                >
                                    <Text style={[styles.typeText, type === 'DEBIT' && styles.typeTextActive]}>
                                        Expense
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.typeButton, type === 'CREDIT' && styles.typeButtonActiveCredit]}
                                    onPress={() => {
                                        setType('CREDIT');
                                        setSelectedCategoryId('');
                                    }}
                                >
                                    <Text style={[styles.typeText, type === 'CREDIT' && styles.typeTextActive]}>
                                        Income
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* AMOUNT INPUT */}
                            <AmountInput
                                value={amount}
                                onChangeText={setAmount}
                                variant="large"
                            />

                            {/* CATEGORY PICKER */}
                            <CategoryPicker
                                categories={filteredCategories}
                                selectedId={selectedCategoryId}
                                onSelect={setSelectedCategoryId}
                            />

                            {/* NOTE INPUT */}
                            <NoteInput
                                value={note}
                                onChangeText={setNote}
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
        typeSelector: {
            flexDirection: 'row',
            backgroundColor: colors.surfaceAlt,
            borderRadius: 14,
            padding: 4,
            borderWidth: 1,
            borderColor: colors.border,
        },
        typeButton: {
            flex: 1,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 10,
        },
        typeButtonActiveDebit: {
            backgroundColor: colors.danger,
        },
        typeButtonActiveCredit: {
            backgroundColor: colors.success,
        },
        typeText: {
            fontSize: 14,
            fontWeight: '600',
            color: colors.textSecondary,
        },
        typeTextActive: {
            color: '#FFFFFF',
        },
        footer: {
            marginTop: 10,
            marginBottom: 24,
        },
    });
