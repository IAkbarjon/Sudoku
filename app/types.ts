export interface Cell {
    number: number
    inputNumber?: number
    fixed: boolean
    x: number
    y: number
}

export type GameDifficulty = 'Легко' | 'Нормально' | 'Сложно'

export type GameBoard = Cell[][]
