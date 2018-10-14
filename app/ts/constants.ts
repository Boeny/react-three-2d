

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

export const MAX_SPEED = 1;

export const MIN_SPEED = 0.1;

export const SHOW_AS_WIREFRAME: boolean = false;

export const WIDTH_SCALE = 1;

export const COLORS = {
    TRUE: '#ffa500',
    FALSE: '#0000ff'
};

export const Z_INDEX_STEP = 0.01;

export const MOUSE_DRAG_MODE_ENABLED: boolean = false;

export const SHOW_COLLIDERS: boolean = true;
