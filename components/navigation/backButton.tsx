import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from '../../contexts/themeContext'

export default function BackButton() {
    const router = useRouter()
    const { theme, colors } = useTheme()
    const [key, setKey] = useState(0)

    useEffect(() => {
        setKey(prev => prev + 1)
    }, [theme])

    const goBack = () => {
        router.back()
    }
    
    return (
        <TouchableOpacity key={key} onPress={() => goBack()}
            style={[
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
            <Feather name='arrow-left' size={32} color={colors.accent} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 18,
        left: 14,
        borderRadius: 50,
        width: 64,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        paddingRight: 10,
        zIndex: 1,
    },
    darkBorder: {
        borderWidth: 1,
        borderColor: '#323440',
    },
})
