interface GridNode {
  x: number;
  y: number;
}

class GridGraph {

  nodes: GridNode[][];
  width: number;
  height: number;

  constructor(nodes: GridNode[][], width: number, height: number) {
    this.nodes = nodes;
    this.width = width;
    this.height = height;
  }

  neighbours(node: GridNode): GridNode[] {
    let result: GridNode[] = [];

    if (this.isInBounds(node.x + 1, node.y + 1)) {
      result.push(this.nodes[node.x + 1][node.y + 1]);
    }
    if (this.isInBounds(node.x + 1, node.y - 1)) {
      result.push(this.nodes[node.x + 1][node.y - 1]);
    }
    if (this.isInBounds(node.x - 1, node.y + 1)) {
      result.push(this.nodes[node.x - 1][node.y + 1]);
    }
    if (this.isInBounds(node.x - 1, node.y - 1)) {
      result.push(this.nodes[node.x - 1][node.y - 1]);
    }

    return result;
  }

  isInBounds(x: number, y: number): boolean {
    return x >= 0 && x <= this.width && y >= 0 && y <= this.height;
  }

  areEqual(nodeA: GridNode, nodeB: GridNode): boolean {
    return nodeA.x === nodeB.x && nodeA.y === nodeB.y;
  }
}

export { GridGraph, GridNode };
