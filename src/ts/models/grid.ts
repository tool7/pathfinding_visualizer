import Visualizer from "../visualizer";
import { Node } from "./graph";

enum TileState {
  Start,
  Goal,
  Wall,
  Unvisited,
  Visited,
  Path,
}

interface Tile {
  x: number;
  y: number;
  state: TileState;
  htmlEl: HTMLElement | SVGElement;
}

enum GridType {
  Square,
  Hexagon,
}

interface IGrid {
  type: GridType;
  tiles: Tile[][];
  startTile: Tile | null;
  goalTile: Tile | null;
  setTileState: (t: Tile, s: TileState) => void;
  clearWallTiles: () => void;
  mapTilesToGraphNodes: () => Node[][];
  horizontalCount: number;
  verticalCount: number;
}

abstract class BaseGrid implements IGrid {

  abstract type: GridType;
  private grabbedTileState: TileState | null = null;
  
  parent: HTMLElement;
  tiles: Tile[][];
  startTile: Tile | null = null;
  goalTile: Tile | null = null;
  horizontalCount: number;
  verticalCount: number;
  
  constructor(parent: HTMLElement, horizontalCount: number, verticalCount: number) {
    this.parent = parent;
    this.horizontalCount = horizontalCount;
    this.verticalCount = verticalCount;

    this.tiles = Array
      .from({ length: this.horizontalCount },
        () => (
          Array.from({ length: this.verticalCount }))
        );
    
    this.parent.addEventListener("mouseup", e => this.onMouseUp(e));
  }

  protected initStartAndGoalTiles() {
    const xOffset = Math.floor(this.horizontalCount * 0.2);
    const yOffset = Math.round(this.verticalCount / 2);
    
    this.startTile = this.tiles[xOffset][yOffset];
    this.goalTile = this.tiles[this.horizontalCount - xOffset][yOffset];

    this.setTileState(this.startTile, TileState.Start);
    this.setTileState(this.goalTile, TileState.Goal);
  }

  protected onTileMouseDown(e: MouseEvent, tile: Tile) {
    e.preventDefault();

    if (Visualizer.isRunning) { return; }

    this.grabbedTileState = tile.state;

    if (tile.state === TileState.Start || tile.state === TileState.Goal ||
        this.grabbedTileState === TileState.Start ||
        this.grabbedTileState === TileState.Goal) {
      return;
    }

    const newState = this.grabbedTileState === TileState.Wall ? TileState.Unvisited : TileState.Wall;
    this.setTileState(tile, newState);
  }

  protected onTileMouseOver(tile: Tile) {
    if (this.grabbedTileState === null || !this.startTile || !this.goalTile ||
        tile.state === TileState.Start || tile.state === TileState.Goal) {
      return;
    }

    if (this.grabbedTileState === TileState.Start) {
      this.setTileState(this.startTile, TileState.Unvisited);
      this.setTileState(tile, TileState.Start);

      this.startTile = tile;
      return;
    }

    if (this.grabbedTileState === TileState.Goal) {
      this.setTileState(this.goalTile, TileState.Unvisited);
      this.setTileState(tile, TileState.Goal);

      this.goalTile = tile;
      return;
    }

    const newState = this.grabbedTileState === TileState.Wall ? TileState.Unvisited : TileState.Wall;
    this.setTileState(tile, newState);
  }

  protected onMouseUp(e: MouseEvent) {
    this.grabbedTileState = null;
  }

  setTileState(tile: Tile, newState: TileState) {
    tile.state = newState;

    while (tile.htmlEl.classList.length !== 0) {
      tile.htmlEl.classList.remove(tile.htmlEl.classList[0]);
    }

    let classPrefix = this.type === GridType.Square ? "square" : "hexagon";

    switch (newState) {
      case TileState.Wall:
        tile.htmlEl.classList.add(`${classPrefix}-tile--wall`);
        break;
      case TileState.Visited:
        tile.htmlEl.classList.add(`${classPrefix}-tile--visited`);
        break;
      case TileState.Unvisited:
        tile.htmlEl.classList.add(`${classPrefix}-tile--unvisited`);
        break;
      case TileState.Start:
        tile.htmlEl.classList.add(`${classPrefix}-tile--start`);
        break;
      case TileState.Goal:
        tile.htmlEl.classList.add(`${classPrefix}-tile--goal`);
        break;
      case TileState.Path:
        tile.htmlEl.classList.add(`${classPrefix}-tile--path`);
        break;
    }
  }

  clearWallTiles() {
    if (Visualizer.isRunning) { return; }

    for (let i = 0; i < this.horizontalCount; i++) {
      for (let j = 0; j < this.verticalCount; j++) {
        const tile = this.tiles[i][j];

        if (tile.state === TileState.Wall) {
          this.setTileState(tile, TileState.Unvisited);
        }
      }
    }
  }

  mapTilesToGraphNodes(): Node[][] {
    let nodes: Node[][] = [];

    for (let i = 0; i < this.horizontalCount; i++) {
      nodes[i] = [];
  
      for (let j = 0; j < this.verticalCount; j++) {
        const tile = this.tiles[i][j];
        const isWall = this.tiles[i][j].state === TileState.Wall;

        nodes[i][j] = { x: tile.x, y: tile.y, isWall };
      }
    }

    return nodes;
  }
}

export { TileState, Tile, GridType, IGrid, BaseGrid };
