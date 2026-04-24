import type { BlockCoordinate, BlockPosition, CellCoordinate, CellPosition } from '@/app/types'
import { GameBoard } from '@/app/types'

// Функция для перемешивания игры
export function shuffleBoard(board: GameBoard) {
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

// Функция для смены местами блоков
export function swapBlocks(board: GameBoard, block1: BlockCoordinate, block2: BlockCoordinate) {
    if (block1.x !== block2.x || block1.y !== block2.y) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const [x1, y1] = [block1.x * 3 + j, block1.y * 3 + i] as number[]
                const [x2, y2] = [block2.x * 3 + j, block1.y * 3 + i] as number[]
                
                [board[y1][x1].number, board[y2][x2].number] = [board[y2][x2].number, board[y1][x1].number]
            }
        }
    }

    return board
}

// Функция для смены местами строк блоков
export function swapBlockRows(board: GameBoard, row1: BlockPosition, row2: BlockPosition) {
    if (row1 !== row2) {
        for (let i = 0; i < 3; i++) {
            swapBlocks(board, { y: row1, x: i as BlockPosition }, { y: row2, x: i as BlockPosition })
        }
    }

    return board
}

// Функция для смены местами столбцов блоков
export function swapBlockColumns(board: GameBoard, firstCol: BlockPosition, secondCol: BlockPosition) {
    if (firstCol !== secondCol) {
        for (let i = 0; i < 3; i++) {
            swapBlocks(board, { x: firstCol, y: i as BlockPosition }, { x: secondCol, y: i as BlockPosition })
        }
    }

    return board
}

// Функция для смены местами строк ячеек внутри строки из блоков
export function swapCellRowsInBlockRow(board: GameBoard, blockRow: BlockPosition, firstCellRow: BlockPosition, secondCellRow: BlockPosition) {
    if (firstCellRow !== secondCellRow) {
        const firstRow = blockRow * 3 + firstCellRow as CellPosition
        const secondRow = blockRow * 3 + secondCellRow as CellPosition

        for (let i = 0; i < 9; i++) {
            swapCells(board, { x: i as CellPosition, y: firstRow }, { x: i as CellPosition, y: secondRow })
        }
    }

    return board
}

// Функция для смены местами столбцов ячеек внути столбца из блоков
export function swapCellColumnsInBlockColumn(board: GameBoard, blockCol: BlockPosition, firstCellCol: BlockPosition, secondCellCol: BlockPosition) {
    if (firstCellCol !== secondCellCol) {
        const firstCol = blockCol * 3 + firstCellCol as CellPosition
        const secondCol = blockCol * 3 + secondCellCol as CellPosition
        
        for (let i = 0; i < 9; i++) {
            swapCells(board, { x: firstCol, y: i as CellPosition }, { x: secondCol, y: i as CellPosition })
        }
    }

    return board
}

export function swapCells(board: GameBoard, firstCell: CellCoordinate, secondCell: CellCoordinate) {
    if (firstCell.x !== secondCell.x || firstCell.y !== secondCell.y) {
        [board[firstCell.y][firstCell.x].number, board[secondCell.y][secondCell.x].number]
            = [board[secondCell.y][secondCell.x].number, board[firstCell.y][firstCell.x].number]
    }

    return board
}

// Транспонирование таблицы
export function transposingBoard(board: GameBoard) {
    for (let i = 0; i < 9; i++) {
        for (let j = i + 1; j < 9; j++) {
            [board[j][i].number, board[i][j].number] = [board[i][j].number, board[j][i].number]
        }
    }
    return board
}
