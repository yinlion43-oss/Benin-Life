// Type declarations for three.js JSM modules that don't have official types
// These modules are part of the three.js package but not included in @types/three

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
  
  export function clone(object: THREE.Object3D): THREE.Object3D;
  export function retarget(target: THREE.SkinnedMesh, source: THREE.SkinnedMesh, options?: { boneMap?: Map<string, string>; preserveMatrix?: boolean }): THREE.SkinnedMesh;
}

declare module 'three/examples/jsm/utils/BufferGeometryUtils.js' {
  import * as THREE from 'three';
  
  export function mergeGeometries(geometries: THREE.BufferGeometry[], useGroups?: boolean): THREE.BufferGeometry;
  export function mergeVertices(geometry: THREE.BufferGeometry, tolerance?: number): THREE.BufferGeometry;
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
  
  export class RoomEnvironment extends THREE.Scene {
    constructor();
    dispose(): void;
  }
}