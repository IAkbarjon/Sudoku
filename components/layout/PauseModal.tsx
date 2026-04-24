// components/PauseModal.tsx
import { useTheme } from '@/contexts/themeContext'
import { screenWidth } from '@/utils/responsive'
import React, { useEffect } from 'react'
import {
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window')

interface PauseModalProps {
  visible: boolean
  onClose: () => void
  onResume: () => void
  onRestart: () => void
  onMainMenu: () => void
  timeElapsed?: number
  mistakes?: number
}

export default function PauseModal({
  visible,
  onClose,
  onResume,
  onRestart,
  onMainMenu,
  timeElapsed = 0,
  mistakes = 0,
}: PauseModalProps) {
  const { colors } = useTheme()
  
  // Анимационные значения
  const scale = useSharedValue(0)
  const opacity = useSharedValue(0)
  const contentOpacity = useSharedValue(0)
  
  // Форматирование времени
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  useEffect(() => {
    if (visible) {
      // Анимация появления
      scale.value = withSequence(
        withTiming(1.1, { duration: 300 }),  // немного увеличиваем
        withSpring(1, { damping: 40, stiffness: 300 })  // возвращаем с пружиной
      )
      opacity.value = withTiming(0.7, { duration: 250 })  // затемнение фона
      contentOpacity.value = withDelay(100, withTiming(1, { duration: 300 }))  // контент появляется чуть позже
    } else {
      // Анимация скрытия
      scale.value = withTiming(0, { duration: 200 })
      opacity.value = withTiming(0, { duration: 200 })
      contentOpacity.value = withTiming(0, { duration: 150 })
    }
  }, [visible])

  // Стиль для затемнённого фона
  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  // Стиль для модального окна
  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  // Стиль для контента (появляется с задержкой)
  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }))

  const handleResume = () => {
    // Анимация закрытия
    scale.value = withTiming(0, { duration: 150 })
    opacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(onResume)()
      runOnJS(onClose)()
    })
  }

  const handleRestart = () => {
    scale.value = withTiming(0, { duration: 150 })
    opacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(onRestart)()
      runOnJS(onClose)()
    })
  }

  const handleMainMenu = () => {
    scale.value = withTiming(0, { duration: 150 })
    opacity.value = withTiming(0, { duration: 150 }, () => {
      runOnJS(onMainMenu)()
      runOnJS(onClose)()
    })
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleResume}
    >
      <View style={styles.container}>
        {/* Затемнённый фон */}
        <Animated.View
          style={[
            styles.backdrop,
            backdropStyle,
            { backgroundColor: '#000' },
          ]}
        />

        {/* Модальное окно */}
        <Animated.View
          style={[
            styles.modal,
            modalStyle,
            { backgroundColor: colors.background },
          ]}
        >
          <Animated.View style={contentStyle}>
            {/* Иконка паузы */}
            <View style={styles.iconContainer}>
              <View style={[styles.pauseIcon, { borderColor: colors.title }]}>
                <View style={[styles.pauseBar, { backgroundColor: colors.title }]} />
                <View style={[styles.pauseBar, { backgroundColor: colors.title }]} />
              </View>
            </View>

            <Text style={[styles.title, { color: colors.title }]}>
              Пауза
            </Text>

            {/* Статистика */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.secondary }]}>
                  Время
                </Text>
                <Text style={[styles.statValue, { color: colors.title }]}>
                  {formatTime(timeElapsed)}
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statLabel, { color: colors.secondary }]}>
                  Ошибки
                </Text>
                <Text style={[styles.statValue, { color: colors.title }]}>
                  {mistakes}
                </Text>
              </View>
            </View>

            {/* Кнопки */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.button, styles.resumeButton, { backgroundColor: colors.accent }]}
                onPress={handleResume}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, { color: '#fff' }]}>
                  Продолжить
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.restartButton, { borderColor: colors.accent }]}
                onPress={handleRestart}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, { color: colors.secondary }]}>
                  Заново
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.menuButton, { borderColor: colors.accent }]}
                onPress={handleMainMenu}
                activeOpacity={0.8}
              >
                <Text style={[styles.buttonText, { color: colors.secondary }]}>
                  Главное меню
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modal: {
    width: screenWidth * 0.85,
    maxWidth: 340,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    marginBottom: 16,
    alignSelf: 'center',
  },
  pauseIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  pauseBar: {
    width: 6,
    height: 24,
    borderRadius: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    alignSelf: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
    paddingVertical: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 12,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#ccc',
  },
  buttonsContainer: {
    width: '100%',
    gap: 12,
    alignItems: 'center',
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 160,
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
  },
  restartButton: {
    borderWidth: 1,
  },
  menuButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
})
