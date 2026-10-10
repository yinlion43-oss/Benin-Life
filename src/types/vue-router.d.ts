// Type declaration for vue-router module
// Provides needed type exports while relying on the real vue-router package types

// Export the needed functions and types at the module level
export function createRouter(options: any): any;
export function createWebHistory(base?: string): any;
export function createWebHashHistory(base?: string): any;
export function createMemoryHistory(base?: string): any;
export function useRouter(): any;
export function useRoute(): any;
export const RouterLink: any;
export const RouterView: any;
export const START_LOCATION: any;
export const NavigationFailureType: any;
export function isNavigationFailure(error: any, type?: any): boolean;
export const NavigationType: any;
export const NavigationDirection: any;

// No local declare module 'vue-router' - the real package types from
// "dist/vue-router.d.mts" will be used instead, which properly
// include afterEach, meta, and all other vue-router v4 features.