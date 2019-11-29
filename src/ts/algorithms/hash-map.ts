class HashMap {

  items: any;

  constructor() {
    this.items = [];
  }

  private getIndex(key: any): string {
    return JSON.stringify(key);
  }

  set(key: any, value: any): void {
    if (!key || !value) { return; }

    const index = this.getIndex(key);
    this.items[index] = value;
  }

  get(key: any): any {
    if (!key) { return null; }

    const index = this.getIndex(key);
    return this.items[index];
  }

  contains(key: any): boolean {
    if (!key) { return false; }

    const index = this.getIndex(key);
    const item = this.items[index];

    return !!item;
  }
}

export default HashMap;
