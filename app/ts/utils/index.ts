import { Vector2, Vector3, Camera } from 'three';
import { COLORS } from '~/constants';


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
