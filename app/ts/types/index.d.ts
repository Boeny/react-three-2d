

declare namespace JSX {
    interface IntrinsicElements {
        scene: any;
        perspectiveCamera: any;
        ambientLight: any;
        pointLight: any;
        directionalLight: any;
        hemisphereLight: any;
        axisHelper: any;
        mainCamera: any;
        color: any;
        mesh: any;
        boxGeometry: any;
        sphereGeometry: any;
        parametricGeometry: any;
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
