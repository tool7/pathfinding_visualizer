import { Tile, TileState } from "./tile";
import Visualizer from "./visualizer";

class Grid {

  private isMouseDown: boolean = false;
  private parent: HTMLElement;
  private tileSize: number;
  private isCtrlKeyDown: boolean = false;
  private parentElementBoundingRect: ClientRect;

  tiles: Tile[][];
  horizontalCount: number;
  verticalCount: number;

  constructor(parent: HTMLElement, tileSize: number, horizontalCount: number, verticalCount: number) {

    this.parent = parent;
    this.tileSize = tileSize;
    this.horizontalCount = horizontalCount;
    this.verticalCount = verticalCount;

    // TODO: Implemented positioning of start and goal tiles

    this.parentElementBoundingRect = parent.getBoundingClientRect();
    this.tiles = Array
      .from({ length: this.horizontalCount },
        () => (
          Array.from({ length: this.verticalCount }))
        );

    this.createGrid();
    this.initStartAndGoalTiles();

    document.addEventListener("keydown", e => this.onKeyDown(e));
    document.addEventListener("keyup", e => this.onKeyUp(e));
    this.parent.addEventListener("mousedown", e => this.onMouseDown(e));
    this.parent.addEventListener("mouseup", e => this.onMouseUp(e));
    this.parent.addEventListener("mousemove", e => this.onMouseMove(e));
  }

  private createGrid() {
    for (let j = 0; j < this.verticalCount; j++) {
      const rowEl = document.createElement("tr");
      
      for (let i = 0; i < this.horizontalCount; i++) {
        const tileEl = document.createElement("td");
        tileEl.id = `${j}-${i}`;

        tileEl.style.width = `${this.tileSize.toString()}px`;
        tileEl.style.height = `${this.tileSize.toString()}px`;
        tileEl.className = "tile tile--unvisited";

        const tileX = i * this.tileSize;
        const tileY = j * this.tileSize;
        const tile: Tile = { x: tileX, y: tileY, state: TileState.Unvisited, htmlEl: tileEl };
        this.tiles[i][j] = tile;

        tileEl.addEventListener("click", () => this.onTileClick(tile));
        rowEl.appendChild(tileEl);
      }

      this.parent.appendChild(rowEl);
    }
  }

  private initStartAndGoalTiles() {
    const startTile = this.tiles[5][10];
    const goalTile = this.tiles[40][30];

    this.setTileState(startTile, TileState.Start);
    this.setTileState(goalTile, TileState.Goal);
  }

  private onMouseDown(e: MouseEvent) {
    e.preventDefault();

    this.isMouseDown = true;
  }

  private onMouseUp(e: MouseEvent) {
    this.isMouseDown = false;
  }

  private onKeyDown(e: KeyboardEvent) {
    if (e.keyCode === 17) {
      this.isCtrlKeyDown = true;
    }
  }

  private onKeyUp(e: KeyboardEvent) {
    if (e.keyCode === 17) {
      this.isCtrlKeyDown = false;
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isMouseDown || Visualizer.isRunning) { return; }

    const mouseX = e.x - this.parentElementBoundingRect.left;
    const mouseY = e.y - this.parentElementBoundingRect.top;

    let foundTile = null;
    for (let i = 0; i < this.horizontalCount; i++) {      
      for (let j = 0; j < this.verticalCount; j++) {
        const t = this.tiles[i][j];

        if (mouseX > t.x && mouseX < (t.x + this.tileSize)
          && mouseY > t.y && mouseY < (t.y + this.tileSize)) {
          foundTile = t;
        }
      }
    }

    if (foundTile && foundTile.state !== TileState.Start && foundTile.state !== TileState.Goal) {
      const newState = this.isCtrlKeyDown ? TileState.Unvisited : TileState.Wall;
      this.setTileState(foundTile, newState);
    }
  }

  private onTileClick(tile: Tile) {
    if (Visualizer.isRunning || tile.state === TileState.Start || tile.state === TileState.Goal) {
      return;
    }

    const newState = this.isCtrlKeyDown ? TileState.Unvisited : TileState.Wall;
    this.setTileState(tile, newState);
  }

  setTileState(tile: Tile, newState: TileState) {
    tile.state = newState;
    tile.htmlEl.className = "tile";

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
}

export default Grid;
