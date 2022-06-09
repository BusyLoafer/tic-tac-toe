import { DEBUG, jSize, lSize } from "../../const"

export type Cell = {
  id?: number,
  value: number,
  weight: number,
  text: string,
  state: Status,
}

export type Point = {
  x: number, y: number
}

export enum Status {
  Open,
  Close
}

export enum Step {
  Round = 'round',
  Cross = 'cross'
}

export const logTableWeights = (table: Cell[][]): void => {
  if (DEBUG) {
    console.log("-------------WEIGHTS--------------")
    const weights = table.map(line => {
      return line.map(cell => cell.weight)
    })
    console.table(weights)
  }
}


export const logTableIds = (table: Cell[][]): void => {
  if (DEBUG) {
    console.log("-------------CELL ID--------------")
    const ids = table.map(line => {
      return line.map(cell => cell.id)
    })
    console.table(ids)
  }
}

export const defaultCells = (dimension: number): Cell[][] => {
  const cells: Cell[][] = []
  for (let i = 0; i < dimension; i++) {
    const linePoint: Cell[] = [];
    for (let j = 0; j < dimension; j++) {
      linePoint.push({
        value: 0,
        text: '_',
        weight: 0,
        state: Status.Open
      })
    }
    cells.push(linePoint);
  }
  return cells;
}

export const getPointPoses = (dimension: number): Point[][] => {
  const pointPoses: Point[][] = [];
  const offset = (jSize * dimension + lSize * (dimension - 1)) * 0.5
  for (let i = 0; i < dimension; i++) {
    const linePoint: Point[] = [];
    for (let j = 0; j < dimension; j++) {
      linePoint.push({
        x: -offset + jSize * (j + 0.5) + lSize * j,
        y: -offset + jSize * (i + 0.5) + lSize * i
      })
    }
    pointPoses.push(linePoint);
  }
  return pointPoses
}

export const addCells = (cells: Cell[][], dimension: number): Cell[][] => {
  cells.forEach(cellLine => {
    cellLine.push({
      value: 0,
      text: '_',
      weight: 0,
      state: Status.Open
    })
    cellLine.unshift({
      value: 0,
      text: '_',
      weight: 0,
      state: Status.Open
    })
  });
  cells.push(getLineCells(dimension))
  cells.unshift(getLineCells(dimension))

  return cells;
}

const getLineCells = (dimension: number): Cell[] => {
  const cells: Cell[] = [];
  for (let i = 0; i < dimension; i++) {
    cells.push({
      value: 0,
      text: '_',
      weight: 0,
      state: Status.Open
    })
  }
  return cells
}