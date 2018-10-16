

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

declare interface Position {
    x: number;
    y: number;
}

declare module "*.json" {
    export const zoom: number;
    export const position: Position;
    export const state: {
        data: Coobject<number>;
        mode: number;
        currentCoo: string | null;
        showNegative: boolean;
        size: { width: number, height: number };
    };
    export const stack: string[];
}
