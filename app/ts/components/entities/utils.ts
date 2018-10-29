import { createArray, getSign, getRandomArrayElement, getRandomArrayIndex, save } from '~/utils';
import { Position } from '~/types';
import { Data, State, BaseState } from './types';
import { INITIAL_VALUE, MAX_PRESSURE_PER_FRAME } from './constants';
import { savedData } from '~/saves';


const DELIMITER = '|';
const DEFAULT_COOS_COUNT = 20;
const AREA_WIDTH = 0.5;
const MAX_ITERATIONS_PER_FRAME = 500;
const COUNT_TO_DELETE = 1;
const WIDTH_OF_LOCAL_CELL = Math.sqrt(INITIAL_VALUE);

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

export function getDefaultData(exist?: Data, width?: number): Data {
    const data: Data = exist || {};
    createArray(DEFAULT_COOS_COUNT).map(() => {
        setDefaultDataAtPosition(data, { x: getCoo(width), y: getCoo(width) }, INITIAL_VALUE);
    });
    return data;
}

function getCoo(width?: number): number {
    return Math.floor((width || AREA_WIDTH) * INITIAL_VALUE * (Math.random() - 0.5));
}

function getCoosWithPositiveValues(data: Data): string[] {
    return Object.keys(data).filter(coo => (data[coo] || 0) > 0);
}

function getCoosWithNegativeValues(data: Data): string[] {
    return Object.keys(data).filter(coo => (data[coo] || 0) < 0);
}

function setDefaultDataAtPosition(data: Data, position: Position, value: number) {
    getCoosWithPositiveValues(data).forEach(coo => {
        const p = getPositionByCoo(coo);
        const middleCoo = getKey({
            x: Math.round((p.x + position.x) / 2),
            y: Math.round((p.y + position.y) / 2)
        });
        data[middleCoo] = (data[middleCoo] || 0) - value;
    });
    data[getKey(position)] = value;
}

export function getSizeFromData(data: Data): { width: number, height: number } {
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

function getStackByData(data: Data): { data: Data, stack: string[] } {
    const resultData = {};
    getCoosWithPositiveValues(data).forEach(coo => {
        setDefaultDataAtPosition(resultData, getPositionByCoo(coo), 2 * (data[coo] || 0));
    });
    return {
        stack: Object.keys(data),
        data: resultData
    };
    // TODO: new stars frequency by size
}

function getNewDataIteration(data: Data, tempStack: string[]): { data: Data, coo: string, stack: string[] } {
    const chance = Math.random() * INITIAL_VALUE;
    const cooToExplode = tempStack.filter(coo => (data[coo] || 0) > chance)[0];
    const index = tempStack.indexOf(cooToExplode);
    return {
        data: updateDataAtCoo(data, tempStack.splice(index === -1 ? 0 : index, COUNT_TO_DELETE)[0]),
        coo: cooToExplode,
        stack: tempStack
    };
}

export function getNewData(data: Data): Data {
    let resultData = data;
    if (stack.length === 0) {
        const result = getStackByData(resultData);
        stack = result.stack;
        resultData = result.data;
    }
    let i = 0;
    while (stack.length > 0 && i < MAX_ITERATIONS_PER_FRAME) {
        const result = getNewDataIteration(resultData, stack);
        stack = result.stack;
        resultData = result.data;
        i += 1;
    }
    if (i === MAX_ITERATIONS_PER_FRAME) {
        console.warn('max iterations per frame has achieved!');
    }
    return resultData;
}

export function getNewDataForSingleCoo(data: Data): { data: Data, coo: string } {
    let resultData = data;
    if (stack.length === 0) {
        const result = getStackByData(resultData);
        stack = result.stack;
        resultData = result.data;
    }
    const result = getNewDataIteration(resultData, stack);
    stack = result.stack;
    return {
        data: result.data,
        coo: result.coo
    };
}

export function getNextData(data: Data): Data {
    let tempStack = stack.slice();
    let resultData = data;
    if (stack.length === 0) {
        const result = getStackByData(resultData);
        tempStack = result.stack;
        resultData = result.data;
    }
    while (tempStack.length > 0) {
        const result = getNewDataIteration(resultData, tempStack);
        tempStack = result.stack;
        resultData = result.data;
    }
    return resultData;
}

function getPositionsAround(position: Position): Position[] {
    return [
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y - 1 },
        { x: position.x + 1, y: position.y },
        { x: position.x - 1, y: position.y }
    ];
}

export function getCoosAroundPosition(position: Position): string[] {
    return getPositionsAround(position).map(getKey);
}

function getCoosByDirections(cooToExplode: string, targetCoos: string[]): string[] {
    const targetPositions = targetCoos.map(getPositionByCoo);
    const currentPosition = getPositionByCoo(cooToExplode);
    return getPositionsAround(currentPosition).filter(positionAround => {
        return targetPositions.some(p => {
            const diff = {
                x: p.x - currentPosition.x,
                y: p.y - currentPosition.y
            };
            return Math.abs(diff.x) > 1 && Math.abs(diff.y) > 1
                && Math.abs(diff.y * positionAround.x / diff.x - positionAround.y) < 0.5;
        });
    }).map(getKey);
}

function updateDataAtCoo(data: Data, cooToExplode: string): Data {
    const valueToDecrease = data[cooToExplode] || 0;
    if (valueToDecrease < 0) {
        return data;
    }
    const coos = getCoosByDirections(
        cooToExplode,
        getCoosWithNegativeValues(data)
    )
        .map(coo => ({ coo, value: data[coo] || 0 }))
        .sort((a, b) => b.value - a.value);
    const result = decreaseValues(coos.map(o => o.value), valueToDecrease);
    coos.forEach((o, i) => data[o.coo] = result.data[i]);
    data[cooToExplode] = result.value;
    return data;
}

type Children = { data: number[], value: number };
function decreaseValues(sortedValues: number[], valueToDecrease: number): Children {
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
    const children = decreaseValues(filtered.map(c => c + diff), filtered[0] + diff);
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
    save();
    console.log(JSON.stringify({
        local,
        stack,
        data,
        nextState,
        state: rest
    }));
}

// ---

function getAndRemoveRandomLocalIndex(array: number[]): number {
    return array.splice(array.length === 1 ? 0 : getRandomArrayIndex(array), 1)[0];
}

export function getLocalData(count: number): Data {
    const data: Data = {};
    const xArray = createArray(WIDTH_OF_LOCAL_CELL);
    const yArray = createArray(WIDTH_OF_LOCAL_CELL);
    createArray(count > 0 ? count : -count).map(() => {
        if (xArray.length === 0 || yArray.length === 0) {
            return;
        }
        const position = {
            x: getAndRemoveRandomLocalIndex(xArray),
            y: getAndRemoveRandomLocalIndex(yArray)
        };
        data[getKey(position)] = INITIAL_VALUE * getSign(count);
        setDefaultDataAtPosition(data, position, INITIAL_VALUE * getSign(count));
    });
    return data;
}

export function getNextLocalData(data: Data): Data {
    const tempStack = Object.keys(data);
    while (tempStack.length > 0) {
        const cooToExplode = getRandomArrayElement(tempStack);
        tempStack.splice(tempStack.indexOf(cooToExplode), COUNT_TO_DELETE);
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
