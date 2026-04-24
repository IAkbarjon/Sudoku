interface Cell {
    number: number
    inputNumber?: number
    fixed: boolean
    x: number
    y: number
}

export type GameDifficulty = 'Легко' | 'Нормально' | 'Сложно'

export type GameBoard = Cell[][]

export { Cell, Cell as default }

export type BlockPosition = 0 | 1 | 2

export type BlockCoordinate = { x: BlockPosition, y: BlockPosition }

export type CellPosition = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export type CellCoordinate = { x: CellPosition, y: CellPosition }
