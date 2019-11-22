// TODO: Implement pathfinding algorithms (Dijkstra, A*)
// and sorting algorithms (bubble, merge, quick, selection, heap, radix)

import Router from "./router";

const navLinkElements = document.querySelectorAll(".navbar__route-btn");
const appElement = document.getElementById("app");

if (!appElement) {
  throw "Cannot find HTML element with ID 'app'";
}

const router = new Router(appElement);

const addActiveClassToNavLink = (linkElement: HTMLElement) => {
  navLinkElements.forEach(el => {
    el.classList.remove("navbar__link--active");
  });

  linkElement.classList.add("navbar__link--active");
};

navLinkElements.forEach((navbarLink: any) => {
  const route = navbarLink.dataset.name;

  navbarLink.addEventListener("click", () => {
    addActiveClassToNavLink(navbarLink);
    router.navigate(route);
  });
});

router.addEventListener("navigation:end", () => {
  const currentRoute = location.hash.substring(1);

  navLinkElements.forEach((navbarLink: any) => {
    if (navbarLink.dataset.name === currentRoute) {
      addActiveClassToNavLink(navbarLink);
      return;
    }
  });
});

let currentRoute = location.hash.substring(1);

if (!router.availableRoutes!.includes(currentRoute)) {
  currentRoute = "/pathfinding";
}

navLinkElements.forEach((el: any) => {
  if (el.dataset.name === currentRoute) {
    addActiveClassToNavLink(el);
    return;
  }
});

router.navigate(currentRoute);
