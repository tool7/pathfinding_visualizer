import Visualizer from "../visualizer";
import { Node } from "./graph";

enum TileState {
  Start,
  Goal,
  Wall,
  Weighted,
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
  protected grabbedTileState: TileState | null = null;
  protected isShiftKeyPressed: boolean = false;
  
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
    document.addEventListener("keydown", e => this.onKeyDown(e));
    document.addEventListener("keyup", e => this.onKeyUp(e));
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

    this.setTileStateByGrabbedTileState(tile);
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

    this.setTileStateByGrabbedTileState(tile);
  }

  protected setTileStateByGrabbedTileState(tile: Tile) {
    let newState = null;

    if (this.isShiftKeyPressed) {
      newState = TileState.Weighted;
    } else {
      switch (this.grabbedTileState) {
        case TileState.Wall:
          newState = TileState.Unvisited;
          break;
        default:
          newState = TileState.Wall;
          break;
      }
    }
    this.setTileState(tile, newState);
  }

  protected onMouseUp(e: MouseEvent) {
    this.grabbedTileState = null;
  }

  protected onKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 16) {
      this.isShiftKeyPressed = true;
    }
  }

  protected onKeyUp(e: KeyboardEvent) {
    if (e.keyCode === 16) {
      this.isShiftKeyPressed = false;
    }
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
      case TileState.Weighted:
          tile.htmlEl.classList.add(`${classPrefix}-tile--weighted`);
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

        if ([TileState.Wall, TileState.Weighted].includes(tile.state)) {
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
        const isWall = tile.state === TileState.Wall;
        const weight = tile.state === TileState.Weighted ? 0.5 : 0;

        nodes[i][j] = { x: tile.x, y: tile.y, isWall, weight };
      }
    }

    return nodes;
  }
}

export { TileState, Tile, GridType, IGrid, BaseGrid };
