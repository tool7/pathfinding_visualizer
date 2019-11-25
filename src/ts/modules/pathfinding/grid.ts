import { Tile, TileState } from "./tile";

class Grid {

  tiles: Tile[][];
  isMouseDown: boolean = false;
  parentElementBoundingRect: ClientRect;

  parent: HTMLElement;
  tileSize: number;
  horizontalCount: number;
  verticalCount: number;

  constructor(parent: HTMLElement, tileSize: number, horizontalCount: number, verticalCount: number) {

    this.parent = parent;
    this.tileSize = tileSize;
    this.horizontalCount = horizontalCount;
    this.verticalCount = verticalCount;

    this.parentElementBoundingRect = parent.getBoundingClientRect();
    this.tiles = Array
      .from({ length: this.horizontalCount },
        () => (
          Array.from({ length: this.verticalCount }))
        );

    this.createGrid();

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
        tileEl.classList.add("tile--unvisited");

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

  private onMouseDown(e: MouseEvent) {
    e.preventDefault();

    this.isMouseDown = true;
  }

  private onMouseUp(e: MouseEvent) {
    this.isMouseDown = false;
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.isMouseDown) { return; }

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

    if (foundTile) {
      this.changeTileState(foundTile, TileState.Wall);
    }
  }

  private changeTileState(tile: Tile, newState: TileState) {
    tile.state = newState;

    switch (newState) {
      case TileState.Wall:
        tile.htmlEl.classList.remove("tile--unvisited"); // TODO: Remove all classes instead
        tile.htmlEl.classList.add("tile--wall");
        break;
      case TileState.Unvisited:
        tile.htmlEl.classList.remove("tile--wall");
        tile.htmlEl.classList.add("tile--unvisited");
        break;
    }
  }

  private onTileClick(tile: Tile) {
    switch (tile.state) {
      case TileState.Unvisited:
        this.changeTileState(tile, TileState.Wall);
        break;
      case TileState.Wall:
        this.changeTileState(tile, TileState.Unvisited);
        break;
    }
  }
}

export default Grid;
