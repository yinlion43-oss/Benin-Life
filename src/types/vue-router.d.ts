// Type declaration for vue-router module
// This is needed because the package is imported dynamically but TypeScript needs type information

declare module 'vue-router' {
  export interface RouteRecordRaw {
    path: string;
    name?: string;
    component?: any;
    redirect?: string | { path: string; name?: string; params?: any };
    props?: boolean | ((route: RouteLocationNormalized) => any);
    meta?: any;
    alias?: string | Array<string>;
    beforeEnter?: (to: RouteLocation, from: RouteLocation, next: Function) => void;
    children?: Array<RouteRecordRaw>;
    caseSensitive?: boolean;
    exact?: boolean;
    hash?: boolean;
    pathToRegexpOptions?: object;
  }

  export interface RouteLocationRaw {
      path?: string;
      params?: any;
      hash?: string;
      query?: any;
      state?: any;
    }
  
    export interface RouteLocation extends RouteLocationRaw {
      readonly path: string;
      readonly params: { [key: string]: string };
      readonly hash: string;
      readonly query: { [key: string]: string };
      readonly state: any;
    }

  export interface RouteLocationNormalized {
    path: string;
    params: { [key: string]: string };
    hash: string;
    query: { [key: string]: string };
    state: any;
  }

  export class Router {
    mode: 'history' | 'hash' | 'abstract';
    base: string;
    routes: RouteRecordRaw[];
    currentRoute: RouteLocationNormalized;
    
    push(location: string | RouteLocation, onComplete?: () => void, onAbort?: () => void): Promise<void>;
    replace(location: string | RouteLocation, onComplete?: () => void, onAbort?: () => void): Promise<void>;
    go(n: number): void;
    back(): void;
    forward(): void;
  }

  export class Route {
    readonly path: string;
    readonly name: string | null;
    readonly hash: string;
    readonly query: { [key: string]: string };
    readonly params: { [key: string]: string };
    readonly fullPath: string;
    readonly matched: RouteRecordRaw[];
    readonly redirectedFrom: Route | null;
    readonly key: string;
  }

  export interface NavigationGuard {
    (to: RouteLocation, from: RouteLocation, next: Function): void;
    onlyInCurrentNavigation?: boolean;
  }

  export interface RouteRecordName {
    name: string;
  }

  export interface RouteRecordPath {
    path: string;
  }

  export interface RouteRecordComponent {
    component: any;
  }

  export interface RouteRecordMeta {
    [key: string]: any;
  }
}