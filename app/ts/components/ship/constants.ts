

export const SHIP_RADIUS = 800;
export const ROLLING_CIRCLE_WIDTH = 15;
export const FIRST_DECK_RADIUS = 50;
export const TERMINAL_RADIUS = 30;
export const ROLLING_CIRCLE_RADIUS = 500;

export const CORRIDOR_DEPTH = 10;
export const CABIN_RADIUS = 10;
const CABINS_COUNT_ON_SIDE = 10;

export const CONTAINER_RADIUS = 1;
export const TERMINAL_WIDTH = 5;

const rollingCircleOuterRadius = ROLLING_CIRCLE_RADIUS + ROLLING_CIRCLE_WIDTH;
export const secondDeckWidth = SHIP_RADIUS - rollingCircleOuterRadius;
export const secondDeckRadius = (SHIP_RADIUS + rollingCircleOuterRadius) / 2;

export const terminalPos = ROLLING_CIRCLE_RADIUS - TERMINAL_RADIUS;
export const corridorEndPos = terminalPos - TERMINAL_RADIUS;

export const depth2 = CORRIDOR_DEPTH / 2;
export const cabinPos = CORRIDOR_DEPTH + CABIN_RADIUS;
export const cabinLength = (ROLLING_CIRCLE_RADIUS - FIRST_DECK_RADIUS) / CABINS_COUNT_ON_SIDE;
