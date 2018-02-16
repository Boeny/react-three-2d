import { Color, Vector3 } from 'three';


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
