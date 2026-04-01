import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useEffect, useState } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, } from 'react-native'
import colors from '../colors.json'
import type { Cell, GameBoard, GameDifficulty } from './types'

export default function Home() {
  const [board, setBoard] = useState<GameBoard>([])
  const [selectedCell, setSelectedCell] = useState<Cell | undefined>()
  const [gameDifficulty, setGameDifficulty] = useState<GameDifficulty>('Нормально')
  const [mistakes, setMistakes] = useState(0)
  const windowWidth = Dimensions.get('window').width

  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(true)
  let timerRef: NodeJS.Timeout | number | null = null

  useEffect(() => {
    initBoard()
  }, [gameDifficulty])

  useEffect(() => {
    if (isRunning) {
      setTime(0)
      timerRef = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000)
    } else {
      clearInterval(timerRef!)
    }

    return () => clearInterval(timerRef!)
  }, [isRunning])

  // Инициализация игры
  const initBoard = () => {
    const newBoard = new Array(9).fill(null).map((_, rowIndex) => (
      new Array(9).fill(null).map((_, colIndex) => ({
        number: ((rowIndex * 3 + Math.floor(rowIndex / 3) + colIndex) % 9) + 1,
        y: rowIndex,
        x: colIndex,
        fixed: Math.random() < 0.5,
      }))
    ))

    setBoard(shuffleBoard(newBoard))
  }

  const shuffleBoard = (board: GameBoard) => {
    const newBoard = [...board]

    for (let block = 0; block < 3; block++) {
      const rows = [block * 3, block * 3 + 1, block * 3 + 2]

      // Перемешание алгоритмом Фишера-Йетса
      rows.sort(() => Math.random() - 0.5)

      const tempRows = rows.map(i => newBoard[i])
      newBoard[block * 3] = tempRows[0]
      newBoard[block * 3 + 1] = tempRows[1]
      newBoard[block * 3 + 2] = tempRows[2]
    }

    // Обновление координат 'y' после перемешивания
    return newBoard.map((row, y) => row.map(cell => ({ ...cell, y })))
  }

  // Выбор ячейки
  const onCellPress = (cell: Cell) => {
    setSelectedCell(cell)
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
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <View style={styles.container}>
      <View style={styles.mainColumn}>
        <View style={[
          styles.board,
          {
            width: windowWidth * 0.94,
            height: windowWidth,
          }
        ]}>
          <View style={styles.gameStats}>
            <Text style={styles.gameStatsText}>{gameDifficulty}</Text>
            <Text style={styles.gameStatsText}>{`Ошибка ${mistakes}/3`}</Text>
            <Text style={styles.gameStatsText}>{formatTime(time)}</Text>
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
                  <TouchableOpacity
                    key={`cell-${cell.x}-${cell.y}`}
                    style={[
                      styles.cell,
                      selectedCell
                        && (cell.x === selectedCell.x || cell.y === selectedCell.y)
                        && styles.highlightedCell,
                      selectedCell
                        && ((Math.floor(cell.x / 3) === Math.floor(selectedCell.x / 3))
                        && (Math.floor(cell.y / 3) === Math.floor(selectedCell.y / 3)))
                        && styles.highlightedCell,
                      selectedCell
                        && (selectedCell.fixed
                          ? true
                          : selectedCell.inputNumber
                        )
                        && (cell.fixed
                          ? true
                          : cell.inputNumber
                        )
                        && cell.number === selectedCell.number
                          ? styles.highlightedCellNumber
                          : {},
                      !cell.fixed
                        && !!cell.inputNumber
                        && cell.inputNumber !== cell.number
                        && styles.errorInputedCell,
                      cell === selectedCell && styles.selectedCell,
                      {
                        // Разделяющая линия по горизонтали
                        borderLeftWidth: cell.x % 3 === 0 ? 1 : 1,
                        borderRightWidth: cell.x % 3 === 2 ? 2 : 1,
                        // Разделяющая линия по вертикали
                        borderTopWidth: cell.y % 3 === 0 ? 1 : 1,
                        borderBottomWidth: cell.y % 3 === 2 ? 2 : 1,
                        // Определение цвета border
                        borderLeftColor: cell.x % 3 === 0 ? 'black' : '#666',
                        borderRightColor: cell.x % 3 === 2 ? 'black' : '#666',
                        borderTopColor: cell.y % 3 === 0 ? 'black' : '#666',
                        borderBottomColor: cell.y % 3 === 2 ? 'black' : '#666',
                      }
                    ]}
                    onPress={() => onCellPress(cell)}
                    ><Text
                      style={[
                        styles.cellText,
                        (selectedCell?.inputNumber && cell.inputNumber) ? (
                          cell.inputNumber === cell.number
                            ? styles.successInputedCell
                            : styles.errorInputedCellText
                        ) : {}
                      ]}
                      >{cell.fixed ? cell.number : cell.inputNumber}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>
        <View style={[
          styles.inputInteraction,
          {
            width: windowWidth * 0.94
          }
        ]}>
          {/* Горизонтальные инструменты */}
          <View style={styles.inputTools}>
            <TouchableOpacity style={styles.inputTool} disabled={!selectedCell}>
              <MaterialCommunityIcons name='eraser' size={44} color={colors.secondary.light} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.inputTool}>
              <MaterialCommunityIcons name='pencil' size={44} color={colors.secondary.light} />
            </TouchableOpacity>
          </View>
          {/* Горизонтальные кнопки ввода */}
          <View style={styles.inputControls}>
            {new Array(9).fill(null).map((_, numIndex) => (
              <TouchableOpacity
                key={`inputControl-${numIndex+1}`}
                style={styles.inputControl}
                onPress={() => onInputControlPress(numIndex + 1)}
                disabled={selectedCell?.fixed}
                ><Text style={styles.inputControlText}>{numIndex + 1}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  // Осноавной столбец
  mainColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 40
  },
  // Игра
  board: {
    backgroundColor: colors.board.light,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  gameStatsText: {
    color: colors.secondary.light,
  },
  gameBoard: {
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    height: '90%',
    borderWidth: 2
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  cell: {
    width: '11.1%',
    height: '100%',
    backgroundColor: colors.board.light,
    borderWidth: 1,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCell: {
    backgroundColor: colors.selectedCell.light,
  },
  highlightedCell: {
    backgroundColor: colors.highlightedCell.light,
  },
  highlightedCellNumber: {
    backgroundColor: colors.highlightedByNumberCell.light,
  },
  cellText: {
    fontSize: 24,
    textAlign: 'center',
    color: colors.cellText.light,
    fontFamily: 'Source Code Pro'
  },
  successInputedCell: {
    color: colors.successCellText.light,
  },
  errorInputedCell: {
    backgroundColor: colors.errorCell.light,
  },
  errorInputedCellText: {
    color: colors.errorCellText.light,
  },
  // Поля взаимодействия
  inputInteraction: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
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
    backgroundColor: colors.board.light,
    padding: 6
  },
  inputControlText: {
    fontSize: 34,
    color: colors.inputControlNumber.light,
    fontFamily: 'Source Code Pro',
  },
})
