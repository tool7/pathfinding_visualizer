class Queue<T> {

  elements: T[];

  constructor(initialElements: T[] = []) {
    this.elements = initialElements;
  }

  isEmpty() {
    return this.elements.length === 0;
  }

  enqueue(item: T): void {
    this.elements.push(item);
  }

  dequeue(): T {
    if (this.elements.length === 0) {
      return null as any;
    }

    let item = this.elements[0];
    this.elements.splice(0, 1);

    return item;
  }
}

export default Queue;
