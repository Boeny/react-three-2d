

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
        bufferGeometry: any;

        lineBasicMaterial: any;
        meshBasicMaterial: any;
        meshLambertMaterial: any;
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
    export const data: Coobject<number>;
    export const stack: string[];
    export const local: Coobject<Coobject<number>>;
    export const nextState: any;
    // state.json
    export const state: any;
    export const camera: any;
}
