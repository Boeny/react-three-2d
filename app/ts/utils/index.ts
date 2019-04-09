import {
    Vector2, Vector3, Raycaster, Intersection, VertexColors, Color, Texture, Object3D
} from 'three';
import { Store as html } from '~/views/html/store';
import { Store as camera } from '~/components/camera/store';
import { Position } from '~/types';
import { FLOAT_MIN_DIFF_TO_BE_EQUAL, SHOW_AS_WIREFRAME, DIFFICULTY_LEVEL } from '~/constants';


export function getMaterialParams(color?: string, texture?: Texture) {
    const result: any = {
        wireframe: SHOW_AS_WIREFRAME,
        color: color ? new Color(color) : '#ffffff',
        vertexColors: VertexColors
    };
    if (texture) {
        result.map = texture;
    }
    return result;
}

const raycaster = new Raycaster();

export function getSelectedObject(position: Vector3, direction: Vector3): Intersection | null {
    if (camera.instance === null) {
        return null;
    }
    raycaster.far = direction.length();
    raycaster.set(position.clone(), direction.clone().normalize());
    const scene = camera.instance.parent;
    const enemies = scene.getObjectByName('enemies') as Object3D | undefined;
    const map = scene.getObjectByName('map');
    const player = scene.getObjectByName('player');
    const result = raycaster.intersectObjects([
        ...(map ? [map] : []),
        ...(player ? [player] : []),
        ...(enemies ? enemies.children : [])
    ]);
    return result && result[0] || null;
}

export function getSelectedObjectFromCamera(screenVector: Vector2): Intersection | null {
    if (camera.instance === null) {
        return null;
    }
    raycaster.setFromCamera(
        {
            x: screenVector.x * 2 / html.state.windowWidth - 1,
            y: -screenVector.y * 2 / html.state.windowHeight + 1
        },
        camera.instance
    );
    return raycaster.intersectObjects(camera.instance.parent.getObjectByName('local-map').children)[0] || null;
}

export function getMouseVector(e: any): Vector2 {
    return new Vector2(e.clientX, e.clientY);
}

export function toWorldVector(screenVector: Vector2): Vector2 {
    if (camera.instance === null) {
        return new Vector2();
    }
    const worldVector = new Vector3(
        screenVector.x * 2 / html.state.windowWidth - 1,
        -screenVector.y * 2 / html.state.windowHeight + 1,
        0.5
    ).unproject(camera.instance);
    return new Vector2(worldVector.x, worldVector.y).multiplyScalar(100);
}

export function toScreenVector(worldVector: Vector2): Vector2 {
    if (camera.instance === null) {
        return new Vector2();
    }
    const screenVector = new Vector3(worldVector.x, worldVector.y, 0).unproject(camera.instance);
    return new Vector2(
        (screenVector.x + 1) * html.state.windowWidth / 2,
        -(screenVector.y - 1) * html.state.windowHeight / 2
    );
}

export function clampByMin(n: number, min: number): number {
    return n < min ? min : n;
}

export function clampByMax(n: number, max: number): number {
    return n > max ? max : n;
}

export function isBordered(n: number, border: number): boolean {
    return n > -border && n < border;
}

export function getRandomArrayIndex<T>(array: T[]): number {
    return Math.floor(Math.random() * (array.length - 1));
}

export function getRandomArrayElement<T>(array: T[]): T {
    return array[getRandomArrayIndex(array)];
}

export function getSign(v: number, def?: number): number {
    return v > 0 ? (def || 1) : (v < 0 ? -(def || 1) : 0);
}

export function vectorsAreEqual(v1: Position, v2: Position, accuracy?: number): boolean {
    return floatEquals(v1.x, v2.x, accuracy) && floatEquals(v1.y, v2.y, accuracy);
}

function floatEquals(v1: number, v2: number, accuracy?: number): boolean {
    const diff = Math.abs(v1 - v2);
    return accuracy ? diff < accuracy : diff < FLOAT_MIN_DIFF_TO_BE_EQUAL;
}

export function save() {
    console.log('saving...');
    console.log(JSON.stringify({
        camera: camera.state
    }));
}

export function getDifficultyLevel(): number {
    return DIFFICULTY_LEVEL.veryEasy;
}

export function getDirection(angle: number): Vector2 {
    return new Vector2(Math.cos(angle), Math.sin(angle));
}

export function getDirection3(angle: number): Vector3 {
    return new Vector3(Math.cos(angle), Math.sin(angle), 0);
}

export function getAngle(cos: number, sin: number): number {
    const angle = Math.acos(cos);
    return sin > 0 ? angle : -angle;
}

export function add(p1: Position, p2: Position): Position {
    return {
        x: p1.x + p2.x,
        y: p1.y + p2.y
    };
}

export function sub(p1: Position, p2: Position): Position {
    return {
        x: p1.x - p2.x,
        y: p1.y - p2.y
    };
}

export function length(p: Position): number {
    return Math.sqrt(p.x * p.x + p.y * p.y);
}
