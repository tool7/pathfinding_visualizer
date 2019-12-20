import { WEIGHTED_NODE_WEIGHT } from "../config/graph-config";
import { Node } from "./graph";
import Visualizer from "../visualizer";

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
  isWeighted: boolean
}

enum GridType {
  Square,
  Hexagon,
}

interface IGrid {
  tiles: Tile[][];
  startTile: Tile | null;
  goalTile: Tile | null;
  setTileState: (t: Tile, s: TileState) => void;
  updateTileStyle: (t: Tile) => void;
  clearWallTiles: () => void;
  mapTilesToGraphNodes: () => Node[][];
  horizontalCount: number;
  verticalCount: number;
}

abstract class BaseGrid extends EventTarget implements IGrid {
  protected grabbedTileState: TileState | null = null;
  protected isShiftKeyPressed: boolean = false;
  
  parent: HTMLElement;
  tiles: Tile[][];
  startTile: Tile | null = null;
  goalTile: Tile | null = null;
  horizontalCount: number;
  verticalCount: number;
  abstract updateTileStyle(t: Tile): void;
  
  constructor(parent: HTMLElement, horizontalCount: number, verticalCount: number) {
    super();

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

    if (Visualizer.isSimulationRunning) { return; }

    this.grabbedTileState = tile.state;

    if (tile.state === TileState.Start || tile.state === TileState.Goal ||
        this.grabbedTileState === TileState.Start ||
        this.grabbedTileState === TileState.Goal) {
      return;
    }

    this.handleGrabbedTile(tile);
    this.dispatchEvent(new CustomEvent("change"));
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
      this.dispatchEvent(new CustomEvent("change"));
      return;
    }

    if (this.grabbedTileState === TileState.Goal) {
      this.setTileState(this.goalTile, TileState.Unvisited);
      this.setTileState(tile, TileState.Goal);

      this.goalTile = tile;
      this.dispatchEvent(new CustomEvent("change"));
      return;
    }

    this.handleGrabbedTile(tile);
    this.dispatchEvent(new CustomEvent("change"));
  }

  protected handleGrabbedTile(tile: Tile) {
    if (this.isShiftKeyPressed && ![TileState.Start, TileState.Goal, TileState.Wall].includes(tile.state)) {
      tile.isWeighted = true;
      this.updateTileStyle(tile);
      return;
    }

    let newState = null;

    switch (this.grabbedTileState) {
      case TileState.Wall:
        newState = TileState.Unvisited;
        break;
      default:
        newState = TileState.Wall;
        break;
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
    this.updateTileStyle(tile);
  }

  clearWallTiles() {
    if (Visualizer.isSimulationRunning) { return; }

    for (let i = 0; i < this.horizontalCount; i++) {
      for (let j = 0; j < this.verticalCount; j++) {
        const tile = this.tiles[i][j];

        if (tile.state === TileState.Wall) {
          this.setTileState(tile, TileState.Unvisited);
        }
      }
    }
  }

  clearWeightedTiles() {
    if (Visualizer.isSimulationRunning) { return; }

    for (let i = 0; i < this.horizontalCount; i++) {
      for (let j = 0; j < this.verticalCount; j++) {
        const tile = this.tiles[i][j];

        if (tile.isWeighted) {
          tile.isWeighted = false;
          this.updateTileStyle(tile);
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
        const weight = tile.isWeighted ? WEIGHTED_NODE_WEIGHT : 0;

        nodes[i][j] = { x: tile.x, y: tile.y, isWall, weight };
      }
    }

    return nodes;
  }
}

export { TileState, Tile, GridType, IGrid, BaseGrid };
