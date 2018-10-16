import { createArray } from '~/utils';
import { INITIAL_VALUE } from './constants';
import { savedData, savedStack } from '~/saves';


const DELIMITER = '|';
const DEFAULT_COOS_COUNT = 10;
const AREA_WIDTH = 50;
const MAX_PRESSURE_PER_FRAME = 20;
const MAX_ITERATIONS_PER_FRAME = 500;

let stack: string[] = savedStack;

type Data = Coobject<number>; // coo -> color

interface Coo {
    x: number;
    y: number;
}

interface FrameBuffer {
    before: Data;
    after: Data;
}

const frameBuffer: FrameBuffer = {
    before: {},
    after: {}
};

export function getDefaultData(): Data {
    if (Object.keys(savedData).length > 0) {
        return savedData;
    }
    const data = {};
    createArray(DEFAULT_COOS_COUNT).map(() => setDefaultDataAtPosition(data, {
        x: getCoo(),
        y: getCoo()
    }));
    return data;
}

function getCoo(): number {
    return Math.floor(AREA_WIDTH * (Math.random() - 0.5));
}

export function getSizeFromData(data: Data): { width: number, height: number } {
    let width = 0;
    let height = 0;
    Object.keys(data).map(coo => {
        const position = getPosition(coo);
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

function setDefaultDataAtPosition(data: Data, position: Coo) {
    data[getKey(position)] = INITIAL_VALUE;
    data[getKey({ x: -position.x, y: -position.y })] = -INITIAL_VALUE;
}

export function getKey(position: Coo): string {
    return `${position.x}${DELIMITER}${position.y}`;
}

function getPosition(coo: string): Coo {
    const position = coo.split(DELIMITER).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    if (position.length !== 2) {
        console.warn(
            `Entities.getPosition: input string = 2 coordinates splitted by "${DELIMITER}"`
        );
        return { x: 0, y: 0 };
    }
    return {
        x: position[0],
        y: position[1]
    };
}


function setStackByData(data: Data) {
    stack = Object.keys(data);
    stack.forEach(coo => {
        const v = data[coo];
        if (v === undefined || v <= -1 || v >= 1) {
            return;
        }
        const position = getPosition(coo);
        const coos = getCoosAround(position);
        if ((data[coos[0]] || 0) <= -1 && (data[coos[1]] || 0) >= 1 ||
            (data[coos[1]] || 0) <= -1 && (data[coos[0]] || 0) >= 1 ||
            (data[coos[2]] || 0) <= -1 && (data[coos[3]] || 0) >= 1 ||
            (data[coos[3]] || 0) <= -1 && (data[coos[2]] || 0) >= 1
        ) {
            setDefaultDataAtPosition(data, position);
        }
    });
    stack = Object.keys(data);
    frameBuffer.before = {};
    Object.keys(frameBuffer.after)
        .forEach(coo => frameBuffer.before[coo] = frameBuffer.after[coo]);
    frameBuffer.after = {};
    stack.forEach(coo => frameBuffer.after[coo] = data[coo]);
}

export function getNewData(data: Data): Data {
    if (stack.length === 0) {
        setStackByData(data);
    }
    let result = data;
    let i = 0;
    while (stack.length > 0 && i < MAX_ITERATIONS_PER_FRAME) {
        const chance = Math.random() * INITIAL_VALUE;
        const cooToExplode = stack.filter(coo => (data[coo] || 0) > chance)[0];
        const index = stack.indexOf(cooToExplode);
        result = updateDataAtCoo(result, stack.splice(index === -1 ? 0 : index, 2)[0]);
        i += 1;
    }
    if (i === MAX_ITERATIONS_PER_FRAME) {
        console.warn('max iterations per frame has achieved!');
    }
    return result;
}

export function getNewValueAtCoo(data: Data, mode: number): { data: Data, coo: string } {
    if (mode > 0) {
        console.log('data', JSON.stringify(data, null, 4));
        console.log('stack', JSON.stringify(stack, null, 4));
        return { data: {}, coo: '' };
    }
    if (stack.length === 0) {
        setStackByData(data);
    }
    const chance = Math.random() * INITIAL_VALUE;
    const cooToExplode = stack.filter(coo => (data[coo] || 0) > chance)[0];
    const index = stack.indexOf(cooToExplode);
    return {
        data: updateDataAtCoo(data, stack.splice(index === -1 ? 0 : index, 1)[0]),
        coo: cooToExplode
    };
}

function getCoosAround(position: Coo): string[] {
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
    const position = getPosition(cooToExplode);
    const coos = getCoosAround(position)
        .map(coo => ({ coo, value: data[coo] || 0 }))
        .sort((a, b) => b.value - a.value);
    const result = decreaseColors(coos.map(o => o.value), valueToDecrease);
    if (result.data.length !== 4) {
        console.warn('result colors length must be 4!');
        return data;
    }
    coos.forEach((o, i) => setDataAtCoo(data, o.coo, result.data[i]));
    setDataAtCoo(data, cooToExplode, result.value);
    return data;
}

type Children = { data: number[], value: number };
function decreaseColors(sortedValues: number[], valueToDecrease: number): Children {
    const filtered = sortedValues.filter(c => valueToDecrease - c > 0);
    if (filtered.length === 0) {
        return { data: sortedValues, value: valueToDecrease };
    }
    const diff = (valueToDecrease - filtered[0]) / (filtered.length + 1);
    if (valueToDecrease - filtered[0] > MAX_PRESSURE_PER_FRAME) {
        return {
            data: [
                ...sortedValues.filter(c => valueToDecrease - c <= 0),
                ...filtered.map(c => c + MAX_PRESSURE_PER_FRAME)
            ],
            value: valueToDecrease - MAX_PRESSURE_PER_FRAME
        };
    }
    const children = decreaseColors(filtered.map(c => c + diff), filtered[0] + diff);
    return {
        data: [
            ...sortedValues.filter(c => valueToDecrease - c <= 0),
            ...children.data
        ],
        value: children.data[children.data.length - 1]
    };
}

function setDataAtCoo(data: Data, coo: string, value: number) {
    data[coo] = value;
}
