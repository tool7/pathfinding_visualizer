export enum TileState {
  Start,
  Goal,
  Wall,
  Unvisited,
  Visited,
  Path,
}

export interface Tile {
  x: number;
  y: number;
  state: TileState,
  htmlEl: HTMLElement
}
