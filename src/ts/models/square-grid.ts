import { SQUARE_TILE_SIZE } from "./../config/grid-config";
import { BaseGrid, Tile, TileState } from "./grid";

export default class SquareGrid extends BaseGrid {

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
        const tile: Tile = {
          x: i,
          y: j,
          state: TileState.Unvisited,
          htmlEl: tileEl,
          isWeighted: false
        };
        
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

  updateTileStyle(tile: Tile) {
    while (tile.htmlEl.classList.length !== 0) {
      tile.htmlEl.classList.remove(tile.htmlEl.classList[0]);
    }

    switch (tile.state) {
      case TileState.Wall:
        tile.htmlEl.classList.add("square-tile--wall");
        break;
      case TileState.Visited:
        tile.htmlEl.classList.add("square-tile--visited");
        break;
      case TileState.Unvisited:
        tile.htmlEl.classList.add("square-tile--unvisited");
        break;
      case TileState.Start:
        tile.htmlEl.classList.add("square-tile--start");
        break;
      case TileState.Goal:
        tile.htmlEl.classList.add("square-tile--goal");
        break;
      case TileState.Path:
        tile.htmlEl.classList.add("square-tile--path");
        break;
    }

    if (tile.isWeighted) {
      if ([TileState.Start, TileState.Goal, TileState.Wall].includes(tile.state)) {
        tile.htmlEl.classList.remove("square-tile--weighted");
      } else {
        tile.htmlEl.classList.add("square-tile--weighted");
      }
    }
  }
}
