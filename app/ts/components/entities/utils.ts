import { Store as camera } from '~/components/camera/store';
import { createArray, getSign, getRandomArrayElement } from '~/utils';
import { Position } from '~/types';
import { Data, State, BaseState } from './types';
import { INITIAL_VALUE, LOCAL_WIDTH, MAX_PRESSURE_PER_FRAME } from './constants';
import { savedData } from '~/saves';


const DELIMITER = '|';
const DEFAULT_COOS_COUNT = 10;
const AREA_WIDTH = 0.3;
const MAX_ITERATIONS_PER_FRAME = 500;

let stack: string[] = savedData.stack;

// ---

interface Color {
    r: number;
    g: number;
    b: number;
}
export function getColor(count: number): Color {
    const c = Math.round(count * 255 / INITIAL_VALUE);
    return c >= 0 ? { r: c, g: c, b: c } : { r: -c, g: 0, b: 0 };
}

export function getRGB(c: Color): string {
    return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

// ---

export function getDefaultData(): Data {
    const data: Data = {};
    createArray(DEFAULT_COOS_COUNT).map(() => {
        let position;
        do {
            position = { x: getCoo(), y: getCoo() };
        } while (data[getKey(position)] !== undefined);
        setDefaultDataAtPosition(data, position);
    });
    return data;
}

function getCoo(): number {
    return Math.floor(AREA_WIDTH * INITIAL_VALUE * (Math.random() - 0.5));
}

export function getSizeFromData(data: Data): State['size'] {
    let width = 0;
    let height = 0;
    Object.keys(data).map(coo => {
        const position = getPositionByCoo(coo);
        if (position.x > width) {
            width = position.x;
        }
        if (position.y > height) {
            height = position.y;
        }
    });
    return {
        width: width * 2,
        height: height * 2
    };
}

function setDefaultDataAtPosition(data: Data, position: Position) {
    data[getKey(position)] = INITIAL_VALUE;
    data[getKey({ x: -position.x, y: -position.y })] = -INITIAL_VALUE;
}

export function getKey(position: Position): string {
    return `${position.x}${DELIMITER}${position.y}`;
}

export function getPositionByCoo(coo: string): Position {
    if (!coo) {
        console.warn('Entities.getPosition: input string should not be empty!"');
        return { x: 0, y: 0 };
    }
    const position = coo.split(DELIMITER).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    if (position.length !== 2) {
        console.warn(
            `Entities.getPosition: input string must contain 2 coordinates splitted by "${DELIMITER}"`
        );
        return { x: 0, y: 0 };
    }
    return {
        x: position[0],
        y: position[1]
    };
}

export function isInStack(coo: string) {
    return stack.indexOf(coo) > -1;
}

// ---

function getStackByData(data: Data): string[] {
    const tempStack = Object.keys(data);
    tempStack.forEach(coo => {
        const v = data[coo];
        if (v === undefined || v <= -1 || v >= 1) {
            return;
        }
        const position = getPositionByCoo(coo);
        const coos = getCoosAroundPosition(position);
        if ((data[coos[0]] || 0) <= -1 && (data[coos[1]] || 0) >= 1 ||
            (data[coos[1]] || 0) <= -1 && (data[coos[0]] || 0) >= 1 ||
            (data[coos[2]] || 0) <= -1 && (data[coos[3]] || 0) >= 1 ||
            (data[coos[3]] || 0) <= -1 && (data[coos[2]] || 0) >= 1
        ) {
            setDefaultDataAtPosition(data, position);
        }
    });
    return Object.keys(data);
}

function getNewDataIteration(data: Data, tempStack: string[]): { data: Data, coo: string, stack: string[] } {
    const chance = Math.random() * INITIAL_VALUE;
    const cooToExplode = tempStack.filter(coo => (data[coo] || 0) > chance)[0];
    const index = tempStack.indexOf(cooToExplode);
    return {
        data: updateDataAtCoo(data, tempStack.splice(index === -1 ? 0 : index, 1)[0]),
        coo: cooToExplode,
        stack: tempStack
    };
}

export function getNewData(data: Data): Data {
    if (stack.length === 0) {
        stack = getStackByData(data);
    }
    let resultData = data;
    let i = 0;
    while (stack.length > 0 && i < MAX_ITERATIONS_PER_FRAME) {
        const result = getNewDataIteration(resultData, stack);
        resultData = result.data;
        stack = result.stack;
        i += 1;
    }
    if (i === MAX_ITERATIONS_PER_FRAME) {
        console.warn('max iterations per frame has achieved!');
    }
    return resultData;
}

export function getNewDataForSingleCoo(data: Data): { data: Data, coo: string } {
    if (stack.length === 0) {
        stack = getStackByData(data);
    }
    const result = getNewDataIteration(data, stack);
    stack = result.stack;
    return {
        data: result.data,
        coo: result.coo
    };
}

export function getNextData(data: Data): Data {
    let tempStack = stack.length === 0 ? getStackByData(data) : stack.slice();
    let resultData = data;
    while (tempStack.length > 0) {
        const result = getNewDataIteration(resultData, tempStack);
        resultData = result.data;
        tempStack = result.stack;
    }
    return resultData;
}

export function getCoosAroundPosition(position: Position): string[] {
    return [
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y - 1 },
        { x: position.x + 1, y: position.y },
        { x: position.x - 1, y: position.y }
    ]
        .map(getKey);
}

function updateDataAtCoo(data: Data, cooToExplode: string): Data {
    const valueToDecrease = data[cooToExplode] || 0;
    const position = getPositionByCoo(cooToExplode);
    const coos = getCoosAroundPosition(position)
        .map(coo => ({ coo, value: data[coo] || 0 }))
        .sort((a, b) => b.value - a.value);
    const result = decreaseColors(coos.map(o => o.value), valueToDecrease);
    if (result.data.length !== 4) {
        console.warn('result colors length must be 4!');
        return data;
    }
    coos.forEach((o, i) => data[o.coo] = result.data[i]);
    data[cooToExplode] = result.value;
    return data;
}

type Children = { data: number[], value: number };
function decreaseColors(sortedValues: number[], valueToDecrease: number): Children {
    const filtered = sortedValues.filter(c => valueToDecrease - c > 0);
    if (filtered.length === 0) {
        return { data: sortedValues, value: valueToDecrease };
    }
    const maxPressure = MAX_PRESSURE_PER_FRAME * INITIAL_VALUE;
    if (valueToDecrease - filtered[0] > maxPressure) {
        return {
            data: [
                ...sortedValues.filter(c => valueToDecrease - c <= 0),
                ...filtered.map(c => c + maxPressure)
            ],
            value: valueToDecrease - maxPressure
        };
    }
    const diff = (valueToDecrease - filtered[0]) / (filtered.length + 1);
    const children = decreaseColors(filtered.map(c => c + diff), filtered[0] + diff);
    return {
        data: [
            ...sortedValues.filter(c => valueToDecrease - c <= 0),
            ...children.data
        ],
        value: children.data[children.data.length - 1]
    };
}

// ---

export function showDataAndStack(state: State, nextState: BaseState) {
    const { data, local, ...rest } = state;
    console.log(JSON.stringify({
        local,
        stack,
        data,
        nextState,
        state: rest,
        camera: camera.state
    }));
}

// ---

function getLocalCoo(width: number) {
    return Math.floor(Math.random() / width);
}

export function getLocalData(count: number): Data {
    const data: Data = {};
    createArray(count > 0 ? count : -count).map(() => {
        let coo;
        do {
            coo = getKey({
                x: getLocalCoo(LOCAL_WIDTH),
                y: getLocalCoo(LOCAL_WIDTH)
            });
        } while (data[coo]);
        data[coo] = INITIAL_VALUE * getSign(count);
    });
    return data;
}

export function getNextLocalData(data: Data): Data {
    const tempStack = Object.keys(data);
    while (tempStack.length > 0) {
        const cooToExplode = getRandomArrayElement(tempStack);
        tempStack.splice(tempStack.indexOf(cooToExplode), 1);
        const valueToDecrease = data[cooToExplode] || 0;
        const maxPressure = MAX_PRESSURE_PER_FRAME * INITIAL_VALUE;
        if (valueToDecrease > maxPressure) {
            data[cooToExplode] = valueToDecrease - maxPressure;
            getCoosAroundPosition(getPositionByCoo(cooToExplode))
                .map(coo => ({ coo, value: data[coo] || 0 }))
                .sort((a, b) => b.value - a.value)
                .forEach(o => {
                    if (valueToDecrease - o.value > 0) {
                        data[o.coo] = o.value + maxPressure;
                    }
                });
        }
    }
    return data;
}
