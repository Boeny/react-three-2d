

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

declare interface MeshStore {
    style: {
        background: string;
    };
    rotationSpeed: number;
    angle: number;
}

declare interface ElementStore {
    DOM: HTMLElement | null;
}

declare interface PositionProps {
    position: THREE.Vector2;
}
