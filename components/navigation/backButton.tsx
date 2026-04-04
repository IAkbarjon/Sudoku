import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { useTheme } from '../../contexts/themeContext'

export default function BackButton() {
    const router = useRouter()
    const { colors } = useTheme()

    const goBack = () => {
        router.back()
    }
    
    return (
        <TouchableOpacity onPress={() => goBack()}
            style={[
                styles.container,
                {
                    shadowColor: '#000'
                }
            ]}>
            <Feather name='arrow-left' size={28} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 14,
        left: 10,
        borderRadius: 50,
        paddingVertical: 2,
        paddingLeft: 10,
        paddingRight: 18,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1,
    },
})
