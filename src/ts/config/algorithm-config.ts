import { Node } from "../models";

// Heuristic functions that calculate distance between two tiles on the grid.
// They tell us how close the visited tile is to the goal.

export function squareGridHeuristic(a: Node, b: Node): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

export function hexagonGridHeuristic(a: Node, b: Node): number {
  return (Math.abs(a.x - b.x) + Math.abs(a.x + a.y - b.x - b.y) + Math.abs(a.y - b.y)) / 2;
}
