// components/DifficultyModal.tsx
import { GameDifficulty } from '@/app/types'
import { useTheme } from '@/contexts/themeContext'
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
  withSpring,
  withTiming
} from 'react-native-reanimated'

const { height: SCREEN_HEIGHT } = Dimensions.get('window')

interface DifficultyModalProps {
  visible: boolean
  onClose: () => void
  onSelectDifficulty: (difficulty: GameDifficulty) => void
}

const difficulties: { type: GameDifficulty, label: string, color: string }[] = [
  { type: 'Легко', label: 'Лёгкий', color: '#4CAF50' },
  { type: 'Нормально', label: 'Средний', color: '#FFC107' },
  { type: 'Сложно', label: 'Сложный', color: '#FF5722' },
]

export default function DifficultyModal({
  visible,
  onClose,
  onSelectDifficulty,
}: DifficultyModalProps) {
  const { colors } = useTheme()
  const translateY = useSharedValue(SCREEN_HEIGHT)
  const opacity = useSharedValue(0)

  useEffect(() => {
    if (visible) {
      // Анимация появления
      translateY.value = withSpring(0, {
        damping: 44,
        stiffness: 300,
      })
      opacity.value = withTiming(0.5, { duration: 200 })
    } else {
      // Анимация скрытия
      translateY.value = withSpring(SCREEN_HEIGHT, {
        damping: 20,
        stiffness: 300,
      })
      opacity.value = withTiming(0, { duration: 200 })
    }
  }, [visible])

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  const handleSelect = (difficulty: GameDifficulty) => {
    // Анимация закрытия перед выбором
    translateY.value = withSpring(SCREEN_HEIGHT, {
      damping: 20,
      stiffness: 300,
    })
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onSelectDifficulty)(difficulty)
      runOnJS(onClose)()
    })
  }

  const handleBackdropPress = () => {
    translateY.value = withSpring(SCREEN_HEIGHT, {
      damping: 20,
      stiffness: 300,
    })
    opacity.value = withTiming(0, { duration: 200 }, () => {
      runOnJS(onClose)()
    })
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Затемнённый фон */}
        <Animated.View
          style={[styles.backdrop, backdropStyle]}
          onTouchEnd={handleBackdropPress}
        />

        {/* Модальное окно */}
        <Animated.View
          style={[
            styles.modal,
            modalStyle,
            { backgroundColor: colors.background },
          ]}
        >
          <View style={styles.handle} />
          
          <Text style={[styles.title, { color: colors.title }]}>
            Выберите сложность
          </Text>

          <View style={styles.difficultiesList}>
            {difficulties.map((item) => (
              <TouchableOpacity
                key={item.type}
                style={[
                  styles.difficultyButton,
                  { backgroundColor: colors.background },
                ]}
                onPress={() => handleSelect(item.type)}
              >
                <View
                  style={[
                    styles.difficultyColor,
                    { backgroundColor: item.color },
                  ]}
                />
                <Text style={[styles.difficultyText, { color: colors.secondary }]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: colors.accent }]}
            onPress={handleBackdropPress}
          >
            <Text style={[styles.cancelText, { color: colors.secondary }]}>
              Отмена
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 34,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  difficultiesList: {
    gap: 12,
    marginBottom: 24,
  },
  difficultyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  difficultyColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 18,
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
})
