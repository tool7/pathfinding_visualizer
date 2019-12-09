import { HEXAGON_TILE_WIDTH } from "./../config/grid-config";
import { convertArrayToAxialCoordinates } from "../helpers/grid-helper";
import { BaseGrid, GridType, Tile, TileState } from "./grid";

export default class HexagonGrid extends BaseGrid {
  type: GridType = GridType.Hexagon;

  constructor(parent: HTMLElement, horizontalCount: number, verticalCount: number) {
    super(parent, horizontalCount, verticalCount);

    this.createGrid();
    this.initStartAndGoalTiles();
  }

  private createGrid() {
    // 0.75 in order to correctly fill grid width with hexagon tiles
    const radius = HEXAGON_TILE_WIDTH * 0.57;

    const hexPoints = (x: number, y: number) => {
      let points = [];
      for (let theta = 0; theta < Math.PI * 2; theta += Math.PI / 3) {
        let pointX, pointY;
        pointX = x + radius * Math.sin(theta);
        pointY = y + radius * Math.cos(theta);
        points.push(pointX + "," + pointY);
      }
      return points.join(" ");
    };

    // Using "array of arrays" storage for axial coordinates
    // Source: https://www.redblobgames.com/grids/hexagons/#map-storage
    for (let j = 0; j < this.verticalCount; j++) {
      for (let i = 0; i < this.horizontalCount; i++) {
        const offset = (Math.sqrt(3) * radius) / 2;

        let screenX = radius + offset * i * 2;
        let screenY = radius + offset * j * Math.sqrt(3);
        if (j % 2 !== 0) {
          screenX += offset;
        }

        let { q, r } = convertArrayToAxialCoordinates(i, j);

        const tileEl: SVGElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        const tile: Tile = { x: q, y: r, state: TileState.Unvisited, htmlEl: tileEl };

        tileEl.setAttribute("points", hexPoints(screenX, screenY));
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
