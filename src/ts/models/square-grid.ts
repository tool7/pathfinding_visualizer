import { SQUARE_TILE_SIZE } from "./../config/grid-config";
import { BaseGrid, GridType, Tile, TileState } from "./grid";

export default class SquareGrid extends BaseGrid {
  type: GridType = GridType.Square;

  constructor(parent: HTMLElement, horizontalCount: number, verticalCount: number) {
    super(parent, horizontalCount, verticalCount);

    this.createGrid();
    this.initStartAndGoalTiles();
  }

  private createGrid() {
    for (let j = 0; j < this.verticalCount; j++) {
      const rowEl = document.createElement("tr");
      
      for (let i = 0; i < this.horizontalCount; i++) {
        const tileEl: HTMLElement = document.createElement("td");
        const tile: Tile = { x: i, y: j, state: TileState.Unvisited, htmlEl: tileEl };
        
        tileEl.style.width = `${SQUARE_TILE_SIZE.toString()}px`;
        tileEl.style.height = `${SQUARE_TILE_SIZE.toString()}px`;
        tileEl.classList.add("square-tile--unvisited");

        this.tiles[i][j] = tile;
        tileEl.addEventListener("mousedown", e => this.onTileMouseDown(e, tile));
        tileEl.addEventListener("mouseover", () => this.onTileMouseOver(tile));

        rowEl.appendChild(tileEl);
      }

      this.parent.appendChild(rowEl);
    }
  }
}
