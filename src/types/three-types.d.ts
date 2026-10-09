// Type declarations for three.js JSM modules that don't have official types
// These modules are part of the three.js package but not included in @types/three

// Main three module types - ensure all commonly used types are available
declare module 'three' {
  export * from './src/Three.js';
}

// Ensure the three.module namespace has all needed types
declare module 'three/module' {
  export {
    // Core types
    Object3D,
    Group,
    Mesh,
    SkinnedMesh,
    Bone,
    Skeleton,
    
    // Geometry types
    BufferGeometry,
    PlaneGeometry,
    BoxGeometry,
    CylinderGeometry,
    SphereGeometry,
    TorusGeometry,
    TorusKnotGeometry,
    ConeGeometry,
    DodecahedronGeometry,
    IcosahedronGeometry,
    OctahedronGeometry,
    RingGeometry,
    RingBufferGeometry,
    BufferAttribute,
    Float32BufferAttribute,
    Float64BufferAttribute,
    Int16BufferAttribute,
    Uint16BufferAttribute,
    Uint32BufferAttribute,
    
    // Material types
    Material,
    MeshBasicMaterial,
    MeshNormalMaterial,
    MeshStandardMaterial,
    MeshPhysicalMaterial,
    MeshDepthMaterial,
    ShadowMaterial,
    
    // Light types
    Light,
    AmbientLight,
    DirectionalLight,
    HemisphereLight,
    PointLight,
    SpotLight,
    
    // Camera types
    Camera,
    PerspectiveCamera,
    OrthographicCamera,
    
    // Math types
    Vector2,
    Vector3,
    Vector4,
    Euler,
    Quaternion,
    Matrix4,
    
    // Rendering types
    Renderer,
    WebGLRenderer,
    CanvasRenderer,
    Scene,
    Camera,
    Color,
    Fog,
    HemisphereLight,
    DirectionalLight,
    AmbientLight,
    PointLight,
    
    // Texture types
    Texture,
    CanvasTexture,
    DataTexture,
    DataTexture3D,
    CubeTexture,
    VideoTexture,
    
    // Other
    Raycaster,
    Plane,
    Box3,
    Sphere,
    Vector2,
    Vector3,
    Vector4,
    Euler,
    Quaternion,
    Matrix3,
    Matrix4,
    Float32BufferAttribute,
    Float64BufferAttribute,
    InterleavedBuffer,
    InterleavedBufferAttribute,
    BufferGeometry,
    InstancedMesh,
    Line,
    Line2,
    LineSegments,
    Points,
    PointsMaterial,
    Sprite,
    SpriteMaterial,
  };
}

// Type declarations for three.js JSM modules that don't have official types
declare module 'three/examples/jsm/loaders/GLTFLoader.js' {
  import * as THREE from 'three';
  
  export class GLTFLoader extends THREE.Loader {
    constructor(manager?: THREE.LoadingManager);
    load(url: string, onLoad: (gltf: GLTF) => void, onProgress?: (event: ProgressEvent) => void, onError?: (event: ErrorEvent) => void): void;
    loadAsync(url: string, onProgress?: (event: ProgressEvent) => void): Promise<GLTF>;
    parse(data: ArrayBuffer | string, path: string, onLoad: (gltf: GLTF) => void, onError?: (event: ErrorEvent) => void): void;
    parseAsync(data: ArrayBuffer | string, path: string): Promise<GLTF>;
    setDRACOLoader(dracoLoader: THREE.DRACOLoader): GLTFLoader;
    setKTX2Loader(ktx2Loader: THREE.KTX2Loader): GLTFLoader;
    setMeshoptDecoder(meshoptDecoder: any): GLTFLoader;
    register(type: string, loader: any): GLTFLoader;
    unregister(type: string): GLTFLoader;
  }

  export interface GLTF {
    animations: THREE.AnimationClip[];
    scene: THREE.Group;
    scenes: THREE.Group[];
    cameras: THREE.Camera[];
    asset: any;
    parser: any;
    userData: any;
  }
}

declare module 'three/examples/jsm/utils/SkeletonUtils.js' {
  import * as THREE from 'three';
  
  export function clone(object: THREE.SkinnedMesh): THREE.SkinnedMesh;
  export function retarget(target: THREE.SkinnedMesh, source: THREE.SkinnedMesh, options?: { boneMap?: Map<string, string>; preserveMatrix?: boolean }): THREE.SkinnedMesh;
}

declare module 'three/examples/jsm/utils/BufferGeometryUtils.js' {
  import * as THREE from 'three';
  
  export function mergeGeometries(geometries: THREE.BufferGeometry[], useGroups?: boolean): THREE.BufferGeometry;
  export function mergeVertices(geometry: THREE.BufferGeometry): THREE.BufferGeometry;
  export function computeMorphedAttributes(geometry: THREE.BufferGeometry, morphTargetsRelative: boolean): { positionAttribute: THREE.BufferAttribute; normalAttribute: THREE.BufferAttribute; morphAttributes: any };
  export function toTrianglesDrawMode(geometry: THREE.BufferGeometry, drawMode: number): THREE.BufferGeometry;
  export function estimateBytesUsed(geometry: THREE.BufferGeometry): number;
  export function mergeBufferGeometries(geometries: THREE.BufferGeometry[]): THREE.BufferGeometry;
  export function mergeBufferAttributes(attributes: THREE.BufferAttribute[]): THREE.BufferAttribute;
  export function interleaveAttributes(attributes: THREE.BufferAttribute[]): THREE.InterleavedBufferAttribute;
  export function computeTangents(geometry: THREE.BufferGeometry): void;
}

declare module 'three/examples/jsm/environments/RoomEnvironment.js' {
  import * as THREE from 'three';
  
  export class RoomEnvironment {
    constructor();
    dispose(): void;
  }
}

// Type declarations for vue-router
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