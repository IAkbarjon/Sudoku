import { Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, TouchableOpacity } from "react-native"

export default function BackButton() {
    const router = useRouter()

    const goBack = () => {
        router.back()
    }
    
    return (
        <TouchableOpacity style={styles.container} onPress={() => goBack()}>
            <Feather name='arrow-left' size={28} />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 14,
        left: 10,
        borderRadius: 'calc(Infinity * 1px)',
        paddingVertical: 2,
        paddingLeft: 10,
        paddingRight: 18,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 1,
    },
})
