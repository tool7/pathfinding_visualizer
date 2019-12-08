import { Node } from "./graph";

export default interface PathfindingResult {
  path: Node[];
  visited: Node[];
}
