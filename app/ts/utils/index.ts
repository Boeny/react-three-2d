import { Color, Vector3, Vector2 } from 'three';


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

export function pointInTheCircle(radius: number, angle: number): Vector3 {
    return new Vector3(
        radius * Math.cos(angle),
        radius * Math.sin(angle),
        0
    );
}

export function getMouseVector(e: any): Vector2 {
    return new Vector2(e.clientX, e.clientY);
}

export function getArray(count: number): undefined[] {
    /* tslint:disable */
    return (Array as any).from(new Array(count));
    /* tslint:enable */
}

export function getNumArray(count: number, start?: number): number[] {
    return getArray(count).map((item, i) => {
        item;
        return i + (start || 0);
    });
}
