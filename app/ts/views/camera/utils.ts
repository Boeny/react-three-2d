import { MIN_SPEED2 } from './constants';
import { Vector2 } from 'three';


export function isMoving(speed: Vector2): boolean {
    return speed.lengthSq() > MIN_SPEED2;
}
