import Queue from "../queue";
import HashMap from "../hash-map";
import PathfindingResult from "../pathfinding-result";
import { Graph, Node } from "../graph";

function breadthFirstSearch(graph: Graph, start: Node, goal: Node): PathfindingResult {
  let frontier = new Queue<Node>();
  let cameFrom = new HashMap();
  let visited: Node[] = [];
  let path: Node[] = [];

  frontier.enqueue(start);
  cameFrom.set(start, null);

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();

    // Adding to visited array only because of visualization
    visited.push(current);

    if (graph.areEqual(current, goal)) { break; }

    graph.neighbors(current).forEach((next: any) => {
      // Checking if it is already visited node
      if (cameFrom.contains(next)) { return; }

      cameFrom.set(next, current);
      frontier.enqueue(next);
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

export default breadthFirstSearch;
