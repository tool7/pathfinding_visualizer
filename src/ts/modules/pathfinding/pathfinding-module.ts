import Router from "../../router";
import Grid from "./grid";
import { GridTileCount } from "../../config/grid-config";
import { getNumberFactors } from "../../helpers/number";

class PathfindingModule {

  static instance: any;

  grid: Grid | null = null;

  constructor() {
    if (!!PathfindingModule.instance) {
      return PathfindingModule.instance;
    }
    PathfindingModule.instance = this;

    Router.instance.addEventListener("navigation:end", () => {    
      this.grid = null;
    });
  }

  init() {
    this.createGrid();
  }

  private createGrid() {
    const windowScreenRatio = window.innerWidth / window.innerHeight;
    const gridTileCountFactors = getNumberFactors(GridTileCount);
    const tileCountSqrt = Math.sqrt(GridTileCount) * windowScreenRatio;
    let closestTileCountFactor = 0;

    for (let i = 0; i < gridTileCountFactors.length - 1; i++) {
      const currentFactor = gridTileCountFactors[i];
      const nextFactor = gridTileCountFactors[i + 1];

      if (tileCountSqrt >= currentFactor && tileCountSqrt <= nextFactor) {
        const currentFactorDistance = Math.abs(tileCountSqrt - currentFactor);
        const nextFactorDistance = Math.abs(tileCountSqrt - nextFactor);

        const factorDistances = {
          [currentFactorDistance]: currentFactor,
          [nextFactorDistance]: nextFactor
        };

        const minDistance = Math.min(currentFactorDistance, nextFactorDistance);
        closestTileCountFactor = factorDistances[minDistance];
        break;
      }
    }
    
    const xAxisTileCount = closestTileCountFactor;
    const yAxisTileCount = GridTileCount / closestTileCountFactor;
    const tileSize = Math.floor(window.innerWidth / xAxisTileCount);

    const gridElement = document.getElementById("grid")!;
    this.grid = new Grid(gridElement, tileSize, xAxisTileCount, yAxisTileCount);
  }

  get content() {
    return `
      <div class="pathfinding-module">
        <h1 class="pathfinding-module__title">Pathfinding module content</h1>

        <table>
          <tbody id="grid"></tbody>
        </table>
      </div>
    `;
  }
}

export default PathfindingModule;
