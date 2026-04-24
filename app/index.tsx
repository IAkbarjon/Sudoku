// app/index.tsx
import DifficultyModal from '@/components/layout/DifficultyModal';
import ToggleThemeButton from '@/components/toggleThemeButton';
import { screenWidth } from '@/utils/responsive';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/themeContext';
import { GameDifficulty } from './types';

export default function Home() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);

  const handlePlayBtnClick = () => {
    setModalVisible(true);
  };

  const onPlay = (difficulty: GameDifficulty) => {
    router.push({
      pathname: '/game',
      params: {
        difficulty: difficulty
      }
    });
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }
    ]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.background} />
      
      <ToggleThemeButton
        style={{
          position: 'absolute',
          top: 12,
          right: 8,
        }}
      />
      
      <Text style={[styles.mainTitle, { color: colors.title }]}>SUDOKU</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={handlePlayBtnClick}
          style={[
            styles.button,
            styles.playBtn,
            { borderColor: colors.continueButton }
          ]}
        >
          <Text style={[styles.playBtnText, { color: colors.continueButton }]}>
            Играть
          </Text>
        </TouchableOpacity>
      </View>

      <DifficultyModal
        visible={modalVisible}
        onClose={handleCloseModal}
        onSelectDifficulty={onPlay}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  mainTitle: {
    fontSize: 78,
    fontWeight: 'bold',
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
    borderRadius: 100,
  },
  playBtn: {
    backgroundColor: 'opacity',
    borderWidth: 1,
  },
  playBtnText: {
    fontSize: 24,
  },
});