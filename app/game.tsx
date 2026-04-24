import GameOverModal from '@/components/layout/GameOverModal'
import PauseModal from '@/components/layout/PauseModal'
import BackButton from '@/components/navigation/backButton'
import { shuffleBoard, swapBlockColumns, swapCellColumnsInBlockColumn, swapCellRowsInBlockRow, transposingBoard } from '@/utils/gameBoardUtils'
import { random } from '@/utils/mathUtils'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import GameCell from '../components/gameCell'
import { useTheme } from '../contexts/themeContext'
import Tools from './tools'
import type { BlockPosition, Cell, GameBoard } from './types'

export default function Home() {
  const [board, setBoard] = useState<GameBoard>([])
  const [selectedCell, setSelectedCell] = useState<Cell | undefined>()
  const [isDraftMode, setIsDraftMode] = useState(false)
  const [mistakes, setMistakes] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isWin, setIsWin] = useState(false)
  const windowWidth = Dimensions.get('window').width
  const { colors } = useTheme()

  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  let timerRef: NodeJS.Timeout | number | null = null

  const { difficulty: gameDifficulty } = useLocalSearchParams()

  const insets = useSafeAreaInsets()
  const router = useRouter()

  useEffect(() => {
    initBoard()
  }, [gameDifficulty])

  useEffect(() => {
    if (isRunning) {
      timerRef = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(timerRef!)
    }

    return () => clearInterval(timerRef!)
  }, [isRunning])

  useEffect(() => {
    if (mistakes === 3) {
      setIsRunning(false)
      setIsGameOver(true)
    }
  }, [mistakes])

  const getGameDifficultyLevel = () => {
    switch (gameDifficulty) {
      case 'Сложно':
        return 0.5
      case 'Нормально':
        return 0.45
      default:
        return 0.05
    }
  }

  const newGame = () => {
    setTime(0)
    setIsGameOver(false)
    setIsWin(false)
    setIsRunning(true)
    setMistakes(0)
    initBoard()
  }

  // Инициализация игры
  const initBoard = () => {
    const newBoard = new Array(9).fill(null).map((_, rowIndex) => (
      new Array(9).fill(null).map((_, colIndex) => ({
        number: ((rowIndex * 3 + Math.floor(rowIndex / 3) + colIndex) % 9) + 1,
        y: rowIndex,
        x: colIndex,
        fixed: Math.random() > getGameDifficultyLevel(),
      }))
    ))

    const shuffledBoard = shuffleBoard(newBoard)
    setBoard(swapBlockColumns(shuffledBoard, 0, 2))

    setBoard(prev => [...transposingBoard(prev)])

    // Перебор всех блочных столбцов
    for (let blockCol = 0; blockCol < 3; blockCol++) {
      // Перемешивание столбцов ячеек внутри блочного столбца
      for (let i = 0; i < 3; i++) {
        setBoard(prev => [...swapCellColumnsInBlockColumn(prev, blockCol as BlockPosition, random.inRange(0, 3) as BlockPosition, random.inRange(0, 3) as BlockPosition)])
      }
    }

    // Перебор всех блочных строк
    for (let blockRow = 0; blockRow < 3; blockRow++) {
      for (let i = 0; i < 3; i++) {
        setBoard(prev => [...swapCellRowsInBlockRow(prev, blockRow as BlockPosition, random.inRange(0, 3) as BlockPosition, random.inRange(0, 3) as BlockPosition)])
      }
    }
  }

  // Ввод числа в ячейку
  const onInputControlPress = (number: number) => {
    if (!selectedCell || selectedCell.fixed) return
    const newCell = { ...selectedCell, inputNumber: number }
    setBoard((prev) => (
      [...prev.map((row) => (
        row.map((cell) => cell === selectedCell ? newCell : cell)
      ))]
    ))
    setSelectedCell(newCell)
    if (number !== selectedCell.number) {
      setMistakes(prev => prev + 1)
    }
    checkWin()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Очистка ячейки от номера
  const eraseCell = () => {
    if (!selectedCell || selectedCell.fixed) return
    const newCell = { ...selectedCell, inputNumber: undefined }
    setBoard(prev => prev.map(row => (
      row.map(cell => cell !== selectedCell ? cell : newCell)
    )))
    setSelectedCell(newCell)
  }

  const checkWin = () => {
    // Проверяем, что все НЕ fixed ячейки имеют inputNumber
    const allCellsFilled = board.every(row => 
      row.every(cell => 
        cell.fixed || cell.inputNumber
      )
    );
    
    if (allCellsFilled) {
      setIsGameOver(true);
    }
  }

  return (
    <View style={[
      styles.container, 
      {
        backgroundColor: colors.background,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
      }
      ]}>
        <BackButton />
        <Tools />
        
      <View style={styles.mainColumn}>
        <View style={[
          styles.board,
          {
            width: windowWidth * 0.94,
            height: windowWidth,
            backgroundColor: colors.board,
          }
        ]}>
          <View style={styles.gameStats}>
            <View style={styles.gameStatsColumn}>
              <Text style={{ color: colors.secondary }}>{gameDifficulty}</Text>
            </View>
            <View style={styles.gameStatsColumn}>
              <Text style={{ color: colors.secondary }}>{`Ошибка ${mistakes}/3`}</Text>
            </View>
            <View style={styles.gameStatsColumn}>
              <Text style={{ color: colors.secondary }}>{formatTime(time)}</Text>
              <TouchableOpacity onPress={() => setIsRunning(prev => !prev)}>
                <Ionicons name={isRunning ? 'pause' : 'play'} size={16} color={colors.secondary} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={[
            styles.gameBoard,
            {
              width: windowWidth * 0.9,
              height: windowWidth * 0.9,
            }
          ]}>
            {board && board.map((row, rowIndex) => (
              <View key={`row-${rowIndex}`} style={styles.row}>
                {row && row.map((cell) => (
                  // Ячейка
                  <GameCell
                    key={`cell-${cell.x}-${cell.y}`}
                    cell={cell}
                    selectedCell={selectedCell}
                    setSelectedCell={setSelectedCell}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>
        <View style={[
          styles.inputInteraction,
          {
            width: windowWidth * 0.94,
            backgroundColor: colors.board,
          }
        ]}>
          {/* Горизонтальные инструменты */}
          <View style={styles.inputTools}>
            <TouchableOpacity style={styles.inputTool} disabled={!selectedCell || selectedCell.fixed} onPress={() => eraseCell()}>
              <MaterialCommunityIcons name='eraser' size={44} color={colors.secondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputTool} onPress={() => setIsDraftMode(prev => !prev)}>
              <MaterialCommunityIcons name='pencil' size={44} color={colors.secondary} />
            </TouchableOpacity>
          </View>
          {/* Горизонтальные кнопки ввода */}
          <View style={styles.inputControls}>
            {new Array(9).fill(null).map((_, numIndex) => (
              <TouchableOpacity
                key={`inputControl-${numIndex+1}`}
                style={[styles.inputControl, { backgroundColor: colors.background }]}
                onPress={() => onInputControlPress(numIndex + 1)}
                disabled={selectedCell?.fixed}
                ><Text style={[styles.inputControlText, { color: colors.inputControlNumber }]}>{numIndex + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <PauseModal
        visible={!isRunning && !isGameOver}
        mistakes={mistakes}
        onClose={() => setIsRunning(true)}
        onResume={() => setIsRunning(true)}
        onRestart={() => {
          newGame()
        }}
        onMainMenu={() => router.back()}
        timeElapsed={time}
      />

      <GameOverModal
        visible={isGameOver}
        isWin={isWin}
        onClose={() => setMistakes(0)}
        onRestart={() => {
          newGame()
        }}
        onMainMenu={() => router.back()}
        mistakes={mistakes}
        timeElapsed={time}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Осноавной столбец
  mainColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
  // Игра
  board: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  gameStatsColumn: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameBoard: {
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: '90%',
    borderWidth: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  // Поля взаимодействия
  inputInteraction: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 8
  },
  inputTools: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  inputTool: {
    padding: 4
  },
  inputControls: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  inputControl: {
    paddingVertical: 8,
    borderRadius: 6,
    padding: 6
  },
  inputControlText: {
    fontSize: 34,
    fontFamily: 'Source Code Pro',
  },
})
