// import { Color, Vector3, Vector2 } from 'three';
// import { WIDTH_SCALE, COLORS } from '~/constants';
import { Vector2 } from 'three';
import { COLORS } from '~/constants';

/*
export function convertToColor(color: string): Color {
    return new Color(color);
}

export function pointInTheEllipse(radiusX: number, radiusY: number, angle: number): Vector3 {
    return new Vector3(
        radiusX * Math.cos(angle),
        radiusY * Math.sin(angle),
        0
    );
}
*/
export function getMouseVector(e: any): Vector2 {
    return new Vector2(e.clientX, e.clientY);
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

export function toWorldVector(v: Vector2): Vector2 {
    return v.multiplyScalar(WIDTH_SCALE);
}

export function toScreenVector(v: Vector2): Vector2 {
    return v.multiplyScalar(1 / WIDTH_SCALE);
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
