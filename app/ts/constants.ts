

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

export const SHOW_AS_WIREFRAME: boolean = false;

export const FLOAT_MIN_DIFF_TO_BE_EQUAL = 0.0001;
