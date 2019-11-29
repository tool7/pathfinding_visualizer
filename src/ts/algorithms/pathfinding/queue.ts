class Queue {

  elements: any[];

  constructor() {
    this.elements = [];
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  enqueue(item: any): void {
    this.elements.push(item);
  }

  dequeue(): any {
    if (this.elements.length === 0) {
      return null;
    }

    let item = this.elements[0];
    this.elements.splice(0, 1);

    return item;
  }
}

export default Queue;
