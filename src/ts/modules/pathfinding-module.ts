class PathfindingModule {

  static instance: any;

  constructor() {
    if (!!PathfindingModule.instance) {
      return PathfindingModule.instance;
    }

    PathfindingModule.instance = this;
  }

  init() {
    
  }

  get content() {
    return `
      <div id="pathfinding-module">
        <h1>Pathfinding module content</h1>
      </div>
    `;
  }
}

export default PathfindingModule;
