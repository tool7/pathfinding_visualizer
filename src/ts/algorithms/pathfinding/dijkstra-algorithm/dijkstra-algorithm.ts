import PriorityQueue from "../priority-queue";
import HashMap from "../hash-map";
import PathfindingResult from "../pathfinding-result";
import { WeightedGraph, Node } from "../graph";

function dijkstraAlgorithm(graph: WeightedGraph, start: Node, goal: Node): PathfindingResult {
  let frontier = new PriorityQueue<Node>();
  let cameFrom = new HashMap();
  let costSoFar = new HashMap();
  let visited: Node[] = [];
  let path: Node[] = [];

  frontier.enqueue(start, 0);
  cameFrom.set(start, null);
  costSoFar.set(start, 0);

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();

    // Adding to visited array only because of visualization
    visited.push(current);

    if (graph.areEqual(current, goal)) { break; }

    graph.neighbors(current).forEach((next: any) => {
      const newCost = costSoFar.get(current) + graph.cost(current, next);

      // If "next" was not yet visited or new cost is lower than
      // previously calculated cost to "next"
      if (!costSoFar.contains(next) || newCost < costSoFar.get(next)) {
        costSoFar.set(next, newCost);
        cameFrom.set(next, current);

        const priority = newCost;
        frontier.enqueue(next, priority);
      }
    });
  }

  // Reconstructing the path
  let current = goal;
  while (!graph.areEqual(current, start)) {
    path.push(current);
    current = cameFrom.get(current);
  }
  path.reverse();

  return { path, visited };
}

export default dijkstraAlgorithm;
