import PathfindingModule from "./modules/pathfinding-module";
import SortingModule from "./modules/sorting-module";

class Router extends EventTarget {

  static instance: any;

  availableRoutes: string[] | undefined;
  rootElement: HTMLElement | undefined;
  routes: { [key: string]: any } | undefined;

  constructor(rootElement: HTMLElement) {
    if (!!Router.instance) {
      return Router.instance;
    }
    super();

    const pathfindingModule = new PathfindingModule();
    const sortingModule = new SortingModule();

    this.availableRoutes = ["/", "/pathfinding"];
    this.rootElement = rootElement;
    this.routes = {
      "/pathfinding": pathfindingModule,
      "/sorting": sortingModule,
    };

    window.onpopstate = () => {
      const route = window.location.hash.substring(1);
      this.loadModule(route);
      this.dispatchEvent(new Event("navigation:end"));
    };
    
    if (!!Router.instance) { return; }
    Router.instance = this;
  }

  loadModule(route: string) {
    if (!this.routes || !this.routes[route] || !this.rootElement) { return; }

    const module = this.routes[route];
    this.rootElement.innerHTML = module.content;

    module.init();
  }

  navigate(path: string) {
    window.history.pushState({}, path, `#${path}`);

    this.loadModule(path);
    this.dispatchEvent(new Event("navigation:end"));
  }
}

export default Router;
