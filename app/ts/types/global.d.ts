

declare namespace JSX {
    interface IntrinsicElements {
        ambientLight: any;
        pointLight: any;
        directionalLight: any;
        hemisphereLight: any;

        mainCamera: any;
        perspectiveCamera: any;
        orthographicCamera: any;

        scene: any;
        axisHelper: any;
        color: any;
        mesh: any;
        group: any;

        geometry: any;
        boxGeometry: any;
        sphereGeometry: any;
        parametricGeometry: any;
        textGeometry: any;
        planeGeometry: any;

        lineBasicMaterial: any;
        meshBasicMaterial: any;
        meshPhongMaterial: any;

        onUpdate?: () => void;
        onKeyDown?: () => void;
        onKeyUp?: () => void;
        onMouseDown?: () => void;
        onMouseUp?: () => void;
        onClick?: () => void;
    }
}

declare module 'react3';

declare interface PositionProps {
    position: THREE.Vector2;
}

declare interface ColorProps {
    color: string;
}

declare interface Coobject<T> {
    [coo: string]: T | undefined;
}

declare module "*.json" {
    // data.json
    export const data: Coobject<number>; // + next-state
    export const stack: string[];
    export const local: Coobject<Coobject<string>>;
    // state.json
    export const state: {
        mode: number;
        currentCoo: string | null;
        showNegative: boolean;
        showStack: boolean;
        size: { width: number, height: number };
    };
    export const camera: {
        zoom: number;
        position: { x: number, y: number, z: number };
        rotation: { x: number, y: number, z: number };
        translation: { x: number, y: number, z: number };
    };
}
