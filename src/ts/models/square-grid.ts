import { IGrid, Tile, TileState } from "./grid";
import { Node } from "./graph";
import Visualizer from "../visualizer";

class SquareGrid implements IGrid {

  private parent: HTMLElement;
  private grabbedTileState: TileState | null = null;
  private tileSize: number;

  tiles: Tile[][];
  startTile: Tile | null = null;
  goalTile: Tile | null = null;
  horizontalCount: number;
  verticalCount: number;

  constructor(parent: HTMLElement, tileSize: number, horizontalCount: number, verticalCount: number) {

    this.parent = parent;
    this.tileSize = tileSize;
    this.horizontalCount = horizontalCount;
    this.verticalCount = verticalCount;

    this.tiles = Array
      .from({ length: this.horizontalCount },
        () => (
          Array.from({ length: this.verticalCount }))
        );

    this.createGrid();
    this.initStartAndGoalTiles();

    this.parent.addEventListener("mouseup", e => this.onMouseUp(e));
  }

  private createGrid() {
    for (let j = 0; j < this.verticalCount; j++) {
      const rowEl = document.createElement("tr");
      
      for (let i = 0; i < this.horizontalCount; i++) {
        const tileEl: HTMLElement = document.createElement("td");
        const tile: Tile = { x: i, y: j, state: TileState.Unvisited, htmlEl: tileEl };
        
        tileEl.style.width = `${this.tileSize.toString()}px`;
        tileEl.style.height = `${this.tileSize.toString()}px`;
        tileEl.classList.add("tile--unvisited");

        this.tiles[i][j] = tile;
        tileEl.addEventListener("mousedown", e => this.onTileMouseDown(e, tile));
        tileEl.addEventListener("mouseover", () => this.onTileMouseOver(tile));

        rowEl.appendChild(tileEl);
      }

      this.parent.appendChild(rowEl);
    }
  }

  private initStartAndGoalTiles() {
    // TODO: Set specific coordinates of start and goal tiles depending on grid size
    this.startTile = this.tiles[5][5];
    this.goalTile = this.tiles[10][10];

    this.setTileState(this.startTile, TileState.Start);
    this.setTileState(this.goalTile, TileState.Goal);
  }

  private onTileMouseDown(e: MouseEvent, tile: Tile) {
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

  private onTileMouseOver(tile: Tile) {
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

  private onMouseUp(e: MouseEvent) {
    this.grabbedTileState = null;
  }

  setTileState(tile: Tile, newState: TileState) {
    tile.state = newState;

    while (tile.htmlEl.classList.length !== 0) {
      tile.htmlEl.classList.remove(tile.htmlEl.classList[0]);
    }

    switch (newState) {
      case TileState.Wall:
        tile.htmlEl.classList.add("tile--wall");
        break;
      case TileState.Visited:
        tile.htmlEl.classList.add("tile--visited");
        break;
      case TileState.Unvisited:
        tile.htmlEl.classList.add("tile--unvisited");
        break;
      case TileState.Start:
        tile.htmlEl.classList.add("tile--start");
        break;
      case TileState.Goal:
        tile.htmlEl.classList.add("tile--goal");
        break;
      case TileState.Path:
        tile.htmlEl.classList.add("tile--path");
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

export default SquareGrid;
