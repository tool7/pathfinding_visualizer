import { convertArrayToAxialCoordinates } from "../helpers/grid-helper";
import { BaseGrid, GridType, Tile, TileState } from "./grid";

export default class HexagonGrid extends BaseGrid {
  type: GridType = GridType.Hexagon;

  constructor(parent: HTMLElement, tileSize: number, horizontalCount: number, verticalCount: number) {
    super(parent, tileSize, horizontalCount, verticalCount);

    this.createGrid();
    this.initStartAndGoalTiles();
  }

  private createGrid() {
    const hexPoints = (x: number, y: number, radius: number) => {
      let points = [];
      for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
        let pointX, pointY;
        pointX = x + radius * Math.sin(theta);
        pointY = y + radius * Math.cos(theta);
        points.push(pointX + "," + pointY);
      }
      return points.join(" ");
    };

    const radius = this.tileSize;

    // Using "array of arrays" storage for axial coordinates
    // Source: https://www.redblobgames.com/grids/hexagons/#map-storage
    for (let j = 0; j < this.verticalCount; j++) {
      for (let i = 0; i < this.horizontalCount; i++) {
        const offset = (Math.sqrt(3) * radius) / 2;

        let screenX = this.tileSize + offset * i * 2;
        let screenY = this.tileSize + offset * j * Math.sqrt(3);
        if (j % 2 !== 0) {
          screenX += offset;
        }

        let { q, r } = convertArrayToAxialCoordinates(i, j);

        const tileEl: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        const tile: Tile = { x: q, y: r, state: TileState.Unvisited, htmlEl: tileEl };

        tileEl.setAttribute("points", hexPoints(screenX, screenY, radius));
        tileEl.style.transformOrigin = `${screenX}px ${screenY}px`;
        tileEl.classList.add("hexagon-tile--unvisited");

        this.tiles[i][j] = tile;
        tileEl.addEventListener("mousedown", e => this.onTileMouseDown(e, tile));
        tileEl.addEventListener("mouseover", () => this.onTileMouseOver(tile));

        this.parent.appendChild(tileEl);
      }
    }
  }
}
