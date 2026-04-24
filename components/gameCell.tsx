import { useTheme } from '@/contexts/themeContext'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { Cell } from '../app/types'

interface CellType {
    cell: Cell
    selectedCell: Cell | undefined
    setSelectedCell: React.Dispatch<React.SetStateAction<Cell | undefined>>
}

export default function GameCell({ cell, selectedCell, setSelectedCell }: CellType) {
    const { colors } = useTheme()

    // Выбор ячейки
    const onCellPress = (cell: Cell) => {
        setSelectedCell(cell)
    }

    return (
        <TouchableOpacity
            style={[
                styles.cell,
                { backgroundColor: colors.board },
                // Подсвечивание ячеек в одном столбце или строке
                selectedCell
                && (selectedCell.x === cell.x || selectedCell.y === cell.y)
                && { backgroundColor: colors.highlightedCell },
                // Подсвечивание ячеек в одной секции с выбранной
                selectedCell
                && ((Math.floor(cell.x / 3) === Math.floor(selectedCell.x / 3))
                && (Math.floor(cell.y / 3) === Math.floor(selectedCell.y / 3)))
                && { backgroundColor: colors.highlightedCell },
                // Подсвечивание ячеек с таким же номеров, как у выбранной
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
                    ? { backgroundColor: colors.highlightedByNumberCell }
                    : {},
                // Подсвечивание ячейки при неправильном вводе
                !cell.fixed
                && !!cell.inputNumber
                && cell.inputNumber !== cell.number
                && { backgroundColor: colors.errorCell },
                // Подсвечивание выбранной ячейки
                cell === selectedCell && { backgroundColor: colors.selectedCell },
                {
                // Разделяющая линия по горизонтали
                borderRightWidth: cell.x === 8 ? 0 : (cell.x % 3 === 2 ? 2 : 1),
                // Разделяющая линия по вертикали
                borderBottomWidth: cell.y === 8 ? 0 : (cell.y % 3 === 2 ? 2 : 1),
                // Определение цвета border
                borderLeftColor: cell.x % 3 === 0 ? 'black' : colors.secondary,
                borderRightColor: cell.x % 3 === 2 ? 'black' : colors.secondary,
                borderTopColor: cell.y % 3 === 0 ? 'black' : colors.secondary,
                borderBottomColor: cell.y % 3 === 2 ? 'black' : colors.secondary,
                }
            ]}
            onPress={() => onCellPress(cell)}
            ><Text
                style={[
                styles.cellText,
                {
                    color: (cell.inputNumber) ? (
                    cell.inputNumber === cell.number
                        ? colors.successCellText
                        : colors.errorCellText
                    ) : colors.cellText
                },
                ]}
                >{cell.fixed ? cell.number : cell.inputNumber}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cell: {
        width: '11.1%',
        height: '100%',
        borderColor: '#555',
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellText: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'Source Code Pro',
    },
})
