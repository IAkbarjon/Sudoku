import AsyncStorage from '@react-native-async-storage/async-storage'
import { createContext, useContext, useEffect, useState } from 'react'
import { useColorScheme } from 'react-native'
import colorsData from '../colors.json'

type ColorKey = keyof typeof colorsData
type ThemeMode = 'light' | 'dark'

export const themes = {
    light: Object.keys(colorsData).reduce((acc, key) => {
        acc[key as ColorKey] = colorsData[key as ColorKey].light
        return acc
    }, {} as Record<ColorKey, string>),

    dark: Object.keys(colorsData).reduce((acc, key) => {
        acc[key as ColorKey] = colorsData[key as ColorKey].dark
        return acc
    }, {} as Record<ColorKey, string>)
}

type ThemeContextType = {
    theme: ThemeMode
    colors: typeof themes.light
    toggleTheme: () => void
    setTheme: (theme: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const systemColorScheme = useColorScheme()
    const [theme, setTheme] = useState<ThemeMode>('light')

    useEffect(() => {
        loadTheme()
    }, [])

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('app_theme')
            if (savedTheme === 'light' || savedTheme === 'dark') {
                setTheme(savedTheme)
            } else {
                setTheme(systemColorScheme === 'dark' ? 'dark' : 'light')
            }
        } catch (error) {
            console.error('Failed to load theme:', error)
        }
    }

    const saveTheme = async (newTheme: ThemeMode) => {
        try {
            await AsyncStorage.setItem('app_theme', newTheme)
        } catch (error) {
            console.error('Failed to save theme:', error)
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        saveTheme(newTheme)
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                colors: themes[theme],
                toggleTheme,
                setTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within THemeProvider')
    }
    return context
}
