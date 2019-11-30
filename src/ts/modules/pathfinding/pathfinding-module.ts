import Router from "../../router";
import Grid from "./grid";
import { GridTileCount } from "../../config/grid-config";
import { getNumberFactors } from "../../helpers/number";

// Algorithms
import breadthFirstSearch from "../../algorithms/pathfinding/breadth-first-search/breadth-first-search";
import Visualizer from "./visualizer";
import { Graph, WeightedGraph } from "../../algorithms/pathfinding/graph";
import { Tile, TileState } from "./tile";

class PathfindingModule {

  static instance: any;

  grid: Grid | null = null;
  visualizer: Visualizer | null = null;
  visualizeToggleButton: HTMLButtonElement | null = null;

  constructor() {
    if (!!PathfindingModule.instance) {
      return PathfindingModule.instance;
    }
    PathfindingModule.instance = this;
  }

  init() {
    this.createGrid();
    this.initControls();
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

  private initControls() {
    this.visualizeToggleButton = document.getElementById("pathfinding-visualize-toggle-btn") as HTMLButtonElement;
    this.visualizeToggleButton.addEventListener("click", () => this.onVisualizeButtonClick())
  }

  private onVisualizeButtonClick() {
    if (this.visualizeToggleButton!.classList.contains("cancel")) {
      Visualizer.clear(this.grid!);

      this.visualizeToggleButton!.innerHTML = "Visualize";
      this.visualizeToggleButton!.className = "start";
      return;
    }

    // TODO: Testing purpose (EXTRACT SOMEWHERE)
    const start = { x: 5, y: 10, isWall: false };
    const goal = { x: 40, y: 30, isWall: false };
    const tiles = this.grid!.tiles;
    const nodes: any[][] = [];

    for (let i = 0; i < this.grid!.horizontalCount; i++) {
      nodes[i] = [];

      for (let j = 0; j < this.grid!.verticalCount; j++) {
        const isWall = tiles[i][j].state === TileState.Wall;
        nodes[i][j] = { x: i, y: j, isWall };
      }
    }

    const graph = new WeightedGraph(nodes, this.grid!.horizontalCount, this.grid!.verticalCount);
    const searchResult = breadthFirstSearch(graph, start, goal);

    Visualizer.simulate(this.grid!, searchResult, 10);

    this.visualizeToggleButton!.innerHTML = "Cancel simulation";
    this.visualizeToggleButton!.className = "cancel";
  }

  get content() {
    return `
      <div class="pathfinding-module">
        <h1 class="pathfinding-module__title">Pathfinding module content</h1>

        <button id="pathfinding-visualize-toggle-btn" class="start">Visualize</button>

        <table>
          <tbody id="grid"></tbody>
        </table>
      </div>
    `;
  }
}

export default PathfindingModule;
