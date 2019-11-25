export enum TileState {
  Wall,
  Unvisited,
  Visited,
}

export interface Tile {
  // TODO: Maybe add grid coordinates (i, j)?
  // i: number;
  // j: number;
  x: number;
  y: number;
  state: TileState,
  htmlEl: HTMLElement
}
