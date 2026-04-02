import { screenWidth } from '@/utils/responsive'
import { useRouter } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../colors.json'

export default function Home() {
  const router = useRouter()

  const onPlay = () => {
    router.push('/game')
  }

  const onContinue = () => {
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>SUDOKU</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => onContinue()}
          style={[
            styles.button,
            styles.continueBtn,
          ]}
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
          <Text style={styles.playBtnText}>Играть</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.light,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  mainTitle: {
    color: colors.title.light,
    fontSize: 44,
    fontWeight: 'bold',
    fontFamily: ''
  },
  buttons: {
    gap: 40,
  },
  button: {
    width: screenWidth * 0.8,
    height: 64,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'calc(Infinity * 1px)',
  },
  continueBtn: {
    backgroundColor: colors.continueButton.light,
    color: '#fff',
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
    color: colors.continueButton.light,
  },
})
