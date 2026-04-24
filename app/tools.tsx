import ToggleThemeButton from "@/components/toggleThemeButton";
import { useTheme } from "@/contexts/themeContext";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function Tools() {
    const { theme, colors } = useTheme()
    const [key, setKey] = useState(0)

    useEffect(() => {
        setKey(prev => prev + 1)
    }, [theme])

    return (
        <View key={key} style={[
            styles.container,
            {
                backgroundColor: colors.board,
                shadowColor: theme === 'light' ? colors.accent : '#000',
                shadowOpacity: theme === 'light' ? 0.3 : 0.2,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: theme === 'light' ? 3 : 2,
            },
            theme === 'dark' && styles.darkBorder,
        ]}>
            <ToggleThemeButton />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        position: 'absolute',
        top: 18,
        right: 14,
        borderRadius: 50,
        height: 42,
        paddingHorizontal: 20,
        gap: 10,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
    },
    darkBorder: {
        borderWidth: 1,
        borderColor: '#323440',
    },
})
