import { Color } from 'three';


export function convertToColor(color: string): Color {
    return new Color(color);
}
