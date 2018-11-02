

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

declare interface Coobject<T> {
    [coo: string]: T | undefined;
}

declare module "*.json" {
    import { Position3 } from '~/types';
    // data.json
    export const data: Coobject<number>;
    // state.json
    export const camera: {
        zoom: number;
        position: Position3;
        rotation: Position3;
        translation: Position3;
    };
}

declare interface Window {
    AudioContext?: AudioContext | null;
    webkitAudioContext?: AudioContext;
}
