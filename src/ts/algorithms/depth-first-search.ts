import { Graph, Node, Stack, HashMap, PathfindingResult } from "../models";

function depthFirstSearch(graph: Graph, start: Node, goal: Node): PathfindingResult {
  let frontier = new Stack<Node>();
  let cameFrom = new HashMap();
  let visited: Node[] = [];
  let path: Node[] = [];

  frontier.push(start);
  cameFrom.set(start, null);

  while (!frontier.isEmpty()) {
    const current = frontier.pop();
    visited.push(current);

    if (graph.areEqual(current, goal)) { break; }

    graph.neighbors(current).forEach((next: any) => {
      // Checking if it is already visited node
      if (visited.includes(next)) { return; }
      
      frontier.push(next);
      cameFrom.set(next, current);
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

export default depthFirstSearch;
