import { screenWidth } from '@/utils/responsive'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../colors.json'
import { useTheme } from '../contexts/themeContext'

export default function Home() {
  const router = useRouter()
  const { colors, toggleTheme, theme } = useTheme()

  const onPlay = () => {
    router.push('/game')
  }

  const onContinue = () => {
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TouchableOpacity style={styles.toggleThemeBtn} onPress={() => toggleTheme()}>
        <Ionicons
          name={theme === 'light' ? 'moon' : 'sunny'}
          size={32}
          color={colors.title}
        />
      </TouchableOpacity>
      
      <Text style={[styles.mainTitle, { color: colors.title }]}>SUDOKU</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => onContinue()}
          style={[styles.button, { backgroundColor: colors.continueButton }]}
        >
          <Text style={styles.continueBtnText}>Продолжить</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onPlay()}
          style={[
            styles.button,
            styles.playBtn,
          ]}
        >
          <Text style={[styles.playBtnText, { color: colors.continueButton }]}>Играть</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  toggleThemeBtn: {
    zIndex: 1,
    position: 'absolute',
    top: 12,
    right: 8,
  },
  mainTitle: {
    fontSize: 44,
    fontWeight: 'bold',
    fontFamily: ''
  },
  buttons: {
    gap: 40,
  },
  button: {
    width: screenWidth * 0.9,
    height: 64,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'calc(Infinity * 1px)',
  },
  playBtn: {
    backgroundColor: 'opacity',
    borderColor: colors.continueButton.light,
    borderWidth: 1,
  },
  continueBtnText: {
    fontSize: 24,
    color: '#fff',
  },
  playBtnText: {
    fontSize: 24,
  },
})
