import {
    Vector2, Vector3, Camera, Raycaster, Scene, Intersection, VertexColors, Color, Texture
} from 'three';
import { Position } from '~/types';
import { COLORS, FLOAT_MIN_DIFF_TO_BE_EQUAL, SHOW_AS_WIREFRAME } from '~/constants';


export function getMaterialParams(color?: string, texture?: Texture) {
    return {
        wireframe: SHOW_AS_WIREFRAME,
        color: color ? new Color(color) : '#ffffff',
        vertexColors: VertexColors,
        map: texture
    };
}

const raycaster = new Raycaster();

export function getSelectedObject(screenVector: Vector2, camera: Camera, scene: Scene): Intersection | null {
    raycaster.setFromCamera(
        {
            x: screenVector.x * 2 / window.innerWidth - 1,
            y: -screenVector.y * 2 / window.innerHeight + 1
        },
        camera
    );
    return raycaster.intersectObjects(scene.getObjectByName('local-map').children)[0] || null;
}

export function getMouseVector(e: any): Vector2 {
    return new Vector2(e.clientX, e.clientY);
}

export function toWorldVector(screenVector: Vector2, camera: Camera): Vector2 {
    const worldVector = new Vector3(
        screenVector.x * 2 / window.innerWidth - 1,
        -screenVector.y * 2 / window.innerHeight + 1,
        0.5
    ).unproject(camera);
    return new Vector2(worldVector.x, worldVector.y).multiplyScalar(100);
}

export function toScreenVector(worldVector: Vector2, camera: Camera): Vector2 {
    const screenVector = new Vector3(worldVector.x, worldVector.y, 0).unproject(camera);
    return new Vector2(
        (screenVector.x + 1) * window.innerWidth / 2,
        -(screenVector.y - 1) * window.innerHeight / 2
    );
}

export function createArray(count: number): number[] {
    return (Array as any as { from: (a: { length: number }) => any[] })
        .from({ length: count }).map((_, i) => i);
}

export function clamp(n: number, border: number): number {
    if (n > border) {
        return border;
    }
    if (n < -border) {
        return -border;
    }
    return n;
}

export function clampByMin(n: number, min: number): number {
    return n < min ? min : n;
}

export function clampByMax(n: number, max: number): number {
    return n > max ? max : n;
}
/*
function clamped(n: number, border: number): boolean {
    return n >= -border && n <= border;
}

export function clampedVector(v: Vector2, border: number): boolean {
    return clamped(v.x, border) && clamped(v.y, border);
}
*/
export function boolColor(v: boolean): string {
    return v ? COLORS.TRUE : COLORS.FALSE;
}

export function getRandomArrayIndex<T>(array: T[]): number {
    return Math.floor(Math.random() * (array.length - 1));
}

export function getRandomArrayElement<T>(array: T[]): T {
    return array[getRandomArrayIndex(array)];
}

export function getSign(v: number): number {
    return v > 0 ? 1 : (v < 0 ? -1 : 0);
}

export function vectorsAreEqual(v1: Position, v2: Position, accuracy?: number): boolean {
    return floatEquals(v1.x, v2.x, accuracy) && floatEquals(v1.y, v2.y, accuracy);
}

function floatEquals(v1: number, v2: number, accuracy?: number): boolean {
    const diff = Math.abs(v1 - v2);
    return accuracy ? diff < accuracy : diff < FLOAT_MIN_DIFF_TO_BE_EQUAL;
}
