import { Node } from "./graph";

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
  htmlEl: HTMLElement | SVGElement,
}

export enum GridType {
  Square,
  Hexagon,
}

export interface IGrid {
  tiles: Tile[][],
  startTile: Tile | null,
  goalTile: Tile | null,
  setTileState: (t: Tile, s: TileState) => void,
  clearWallTiles: () => void,
  mapTilesToGraphNodes: () => Node[][],
  horizontalCount: number,
  verticalCount: number,
}
