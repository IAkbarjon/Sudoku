import { useTheme } from "@/contexts/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

export default function ToggleThemeButton({ style }: { style?: StyleProp<ViewStyle> }) {
    const { theme, colors, toggleTheme } = useTheme()
    
    return (
        <TouchableOpacity style={[styles.toggleThemeBtn, style]} onPress={() => toggleTheme()}>
            <Ionicons
                name={theme === 'light' ? 'moon' : 'sunny'}
                size={32}
                color={colors.secondary}
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    toggleThemeBtn: {
        zIndex: 2,
    },
})