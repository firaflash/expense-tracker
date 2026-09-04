import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
} from "react-native";
import useTheme from "../../hooks/useTheme";

// 1. Add 'disabled' to the props interface
export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  disabled?: boolean; // <-- NEW: Allows the button to be disabled
}

export default function PrimaryButton({
  label,
  onPress,
  style,
  disabled = false,
}: PrimaryButtonProps) {
  const colors = useTheme();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[
        styles.button,
        disabled && styles.buttonDisabled, // Apply disabled style if true
        style,
      ]}
      onPress={onPress}
      disabled={disabled} // <-- NEW: Native prop to prevent presses
      activeOpacity={disabled ? 1 : 0.7} // Prevent fade effect when disabled
    >
      {/* Show a loading spinner if disabled (assuming disabled means loading) */}
      {disabled ? (
        <ActivityIndicator size="small" color={colors.surface} />
      ) : (
        <Text style={styles.text}>{label}</Text>
      )}
    </TouchableOpacity>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    button: {
      backgroundColor: colors.champagne,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      // Add a subtle shadow for depth
      shadowColor: colors.champagne,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    buttonDisabled: {
      backgroundColor: colors.textMuted, // Gray out the button
      shadowOpacity: 0,
      elevation: 0,
    },
    text: {
      color: colors.surface, // Dark text on gold button
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
  });
