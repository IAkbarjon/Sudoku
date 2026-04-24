import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'
import 'react-native-reanimated'

import { ThemeProvider } from '../contexts/themeContext'

export const unstable_settings = {
  anchor: '(tabs)',
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false, statusBarStyle: 'dark' }}>
        <Stack.Screen name='index' />
      </Stack>
      <StatusBar barStyle={'dark-content'} backgroundColor={'lightgray'} />
    </ThemeProvider>
  );
}
