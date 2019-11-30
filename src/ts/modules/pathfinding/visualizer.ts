import Grid from "./grid";
import { TileState } from "./tile";
import PathfindingResult from "../../algorithms/pathfinding/pathfinding-result";
import { Node } from "../../algorithms/pathfinding/graph";
import Queue from "../../algorithms/pathfinding/queue";

class Visualizer {

  static get isRunning(): boolean {
    return this._isRunning;
  };

  private static _isRunning: boolean = false;
  private static _intervalId: number;

  private static simulateTiles(nodeQueue: Queue<Node>, grid: Grid, newTileState: TileState, simulationStepDelay: number, completeCallback?: () => void) {
    this._intervalId = setInterval(() => {
      const nextNode = nodeQueue.dequeue();

      if (!nextNode) {
        clearInterval(this._intervalId);
        completeCallback && completeCallback();
        Visualizer._isRunning = false;
        return;
      }

      const tile = grid.tiles[nextNode.x][nextNode.y];
      if (tile.state === TileState.Start || tile.state === TileState.Goal) {
        return;
      }

      grid.setTileState(tile, newTileState);

    }, simulationStepDelay);
  }

  static simulate(grid: Grid, pathfindingResult: PathfindingResult, simulationStepDelay: number = 100) {
    if (Visualizer._isRunning) { return; }

    Visualizer._isRunning = true;

    const visitedQueue = new Queue<Node>(pathfindingResult.visited);
    const pathQueue = new Queue<Node>(pathfindingResult.path);

    this.simulateTiles(visitedQueue, grid, TileState.Visited, simulationStepDelay, () => {
      this.simulateTiles(pathQueue, grid, TileState.Path, 40);
    });
  }

  static clear(grid: Grid) {
    clearInterval(this._intervalId);
    this._isRunning = false;

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
