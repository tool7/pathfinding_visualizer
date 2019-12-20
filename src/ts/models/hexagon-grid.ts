import { HEXAGON_TILE_WIDTH } from "./../config/grid-config";
import { convertArrayToAxialCoordinates } from "../helpers/grid-helper";
import { BaseGrid, Tile, TileState } from "./grid";

const SVG_NAMESPACE_URI = "http://www.w3.org/2000/svg";

export default class HexagonGrid extends BaseGrid {
  
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

        const tileEl: SVGElement = document.createElementNS(SVG_NAMESPACE_URI, "g");
        const polygonEl: SVGElement = document.createElementNS(SVG_NAMESPACE_URI, "polygon");
        const foreignObjectEl: SVGElement = document.createElementNS(SVG_NAMESPACE_URI, "foreignObject");

        const tile: Tile = {
          x: q,
          y: r,
          state: TileState.Unvisited,
          htmlEl: tileEl,
          isWeighted: false
        };

        polygonEl.setAttribute("points", hexPoints(screenX, screenY));
        polygonEl.style.transformOrigin = `${screenX}px ${screenY}px`;
        polygonEl.classList.add("hexagon-tile--unvisited");

        foreignObjectEl.setAttribute("x", `${screenX - (HEXAGON_TILE_WIDTH / 2)}`);
        foreignObjectEl.setAttribute("y", `${screenY - (HEXAGON_TILE_WIDTH / 2)}`);
        foreignObjectEl.setAttribute("width", `${HEXAGON_TILE_WIDTH}`);
        foreignObjectEl.setAttribute("height", `${HEXAGON_TILE_WIDTH}`);
        foreignObjectEl.style.transformOrigin = `${screenX}px ${screenY}px`;

        this.tiles[i][j] = tile;
        tileEl.addEventListener("mousedown", e => this.onTileMouseDown(e, tile));
        tileEl.addEventListener("mouseover", () => this.onTileMouseOver(tile));

        tileEl.appendChild(polygonEl);
        tileEl.appendChild(foreignObjectEl);
        this.parent.appendChild(tileEl);
      }
    }
  }

  updateTileStyle(tile: Tile) {
    const polygonEl = tile.htmlEl.getElementsByTagName("polygon")[0];
    const foreignObjectEl = tile.htmlEl.getElementsByTagName("foreignObject")[0];

    while (polygonEl.classList.length !== 0) {
      polygonEl.classList.remove(polygonEl.classList[0]);
    }

    switch (tile.state) {
      case TileState.Wall:
        polygonEl.classList.add("hexagon-tile--wall");
        break;
      case TileState.Visited:
        polygonEl.classList.add("hexagon-tile--visited");
        break;
      case TileState.Unvisited:
        polygonEl.classList.add("hexagon-tile--unvisited");
        break;
      case TileState.Start:
        polygonEl.classList.add("hexagon-tile--start");
        break;
      case TileState.Goal:
        polygonEl.classList.add("hexagon-tile--goal");
        break;
      case TileState.Path:
        polygonEl.classList.add("hexagon-tile--path");
        break;
    }

    if (tile.isWeighted) {
      if ([TileState.Start, TileState.Goal, TileState.Wall].includes(tile.state)) {
        foreignObjectEl.classList.remove("hexagon-tile--weighted");
      } else {
        foreignObjectEl.classList.add("hexagon-tile--weighted");
      }
    }
  }
}
