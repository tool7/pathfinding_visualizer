import { convertAxialToArrayIndicies } from "./helpers/grid-helper";
import { IGrid, Tile } from "./models/grid";
import { TileState } from "./models/grid";
import PathfindingResult from "./models/pathfinding-result";
import { Node } from "./models/graph";
import Queue from "./models/queue";
import SquareGrid from "./models/square-grid";
import HexagonGrid from "./models/hexagon-grid";

class Visualizer {

  static get isRunning(): boolean {
    return Visualizer._isRunning;
  };

  private static _isRunning: boolean = false;
  private static _intervalId: number;

  private static simulateTiles(nodeQueue: Queue<Node>, grid: IGrid, newTileState: TileState, simulationStepDelay: number, completeCallback?: () => void) {
    Visualizer._intervalId = setInterval(() => {
      const nextNode = nodeQueue.dequeue();

      if (!nextNode) {
        clearInterval(Visualizer._intervalId);
        completeCallback && completeCallback();
        return;
      }

      let tile: any;

      if (grid instanceof SquareGrid) {
        tile = grid.tiles[nextNode.x][nextNode.y];
      } else if (grid instanceof HexagonGrid) {
        let { i, j } = convertAxialToArrayIndicies(nextNode.x, nextNode.y);
        tile = grid.tiles[i][j];
      }

      if (tile.state === TileState.Start || tile.state === TileState.Goal) {
        return;
      }

      grid.setTileState(tile, newTileState);

    }, simulationStepDelay);
  }

  static simulate(grid: IGrid, pathfindingResult: PathfindingResult, simulationStepDelay: number = 100) {
    if (Visualizer._isRunning) { return; }

    Visualizer._isRunning = true;

    const visitedQueue = new Queue<Node>(pathfindingResult.visited);
    const pathQueue = new Queue<Node>(pathfindingResult.path);

    Visualizer.simulateTiles(visitedQueue, grid, TileState.Visited, simulationStepDelay, () => {
      Visualizer.simulateTiles(pathQueue, grid, TileState.Path, 40, () => {
        Visualizer._isRunning = false;
      });
    });
  }

  static clear(grid: IGrid) {
    clearInterval(Visualizer._intervalId);
    Visualizer._isRunning = false;

    for (let i = 0; i < grid.horizontalCount; i++) {
      for (let j = 0; j < grid.verticalCount; j++) {
        const tile = grid.tiles[i][j];

        if ([TileState.Wall, TileState.Start, TileState.Goal].includes(tile.state)) {
          continue;
        }
  
        grid.setTileState(tile, TileState.Unvisited);
      }
    }
  }
}

export default Visualizer;
