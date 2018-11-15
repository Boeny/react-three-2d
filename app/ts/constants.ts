import { Vector3 } from 'three';


export const ROOT_ELEMENT_ID = 'root';

export enum MOUSE {
    left,
    wheel,
    right
}

interface KEYS {
    SPACE: ' ';
    UP: 'ArrowUp';
    DOWN: 'ArrowDown';
    LEFT: 'ArrowLeft';
    RIGHT: 'ArrowRight';
    ENTER: 'Enter';
}

export const KEY: KEYS = {
    SPACE: ' ',
    UP: 'ArrowUp',
    DOWN: 'ArrowDown',
    LEFT: 'ArrowLeft',
    RIGHT: 'ArrowRight',
    ENTER: 'Enter'
};

export const MIN_SPEED = 0.01;

export const SHOW_AS_WIREFRAME: boolean = false;

export const MOUSE_DRAG_MODE_ENABLED: boolean = false;

export const FLOAT_MIN_DIFF_TO_BE_EQUAL = 0.0001;

export enum DIFFICULTY_LEVEL {
    demo,
    veryEasy,
    easy,
    middle,
    hard,
    veryHard,
    nightmare
}

export const EMPTY_VECTOR3 = new Vector3();
