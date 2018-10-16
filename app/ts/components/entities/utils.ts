import { createArray } from '~/utils';
import { INITIAL_VALUE } from './constants';


const NEGATIVE_VALUE = -INITIAL_VALUE / 2;
const DELIMITER = '|';
const AREA_WIDTH = 50;
const DEFAULT_COOS = createArray(20).map(() => {
    const position = { x: getCoo(), y: getCoo() };
    return {
        positive: getKey(position),
        negative: getKey({ x: -position.x, y: -position.y })
    };
});
const MAX_PRESSURE_PER_FRAME = 10;
const MAX_ITERATIONS_PER_FRAME = 50;


type Data = Coobject<number>; // coo -> color

interface Coo {
    x: number;
    y: number;
}

function getCoo() {
    return Math.floor(AREA_WIDTH * (Math.random() - 0.5));
}

export function setDefaultData(data: Data) {
    DEFAULT_COOS.forEach(coo => {
        data[coo.positive] = INITIAL_VALUE;
        data[coo.negative] = NEGATIVE_VALUE;
    });
    return data;
}

function getKey(position: Coo): string {
    return `${position.x}${DELIMITER}${position.y}`;
}

export function getNonEmptyCoordinates(data: Data): string[] {
    return Object.keys(data);
}

export function getPosition(coo: string): Coo {
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


interface FrameBuffer {
    before: Data;
    after: Data;
}

const frameBuffer: FrameBuffer = {
    before: {},
    after: {}
};

let stack: string[] = [];

export function getNewData(data: Data): Data {
    if (stack.length === 0) {
        setDefaultData(data);
        stack = Object.keys(data);
        frameBuffer.before = {};
        Object.keys(frameBuffer.after).forEach(coo => frameBuffer.before[coo] = frameBuffer.after[coo]);
        frameBuffer.after = {};
        stack.forEach(coo => frameBuffer.after[coo] = data[coo]);
    }
    let result = data;
    let i = 0;
    while (stack.length > 0 && i < MAX_ITERATIONS_PER_FRAME) {
        const chance = Math.random() * INITIAL_VALUE;
        const cooToExplode = stack.filter(coo => (data[coo] || 0) > chance)[0];
        const index = stack.indexOf(cooToExplode);
        result = updateDataAtCoo(result, stack.splice(index === -1 ? 0 : index, 1)[0]);
        i += 1;
    }
    if (i === MAX_ITERATIONS_PER_FRAME) {
        console.warn('max iterations per frame has achieved!');
    }
    return result;
}

export function getNewValueAtCoo(data: Data): { data: Data, coo: string } {
    if (stack.length === 0) {
        setDefaultData(data);
        stack = Object.keys(data);
        frameBuffer.before = {};
        Object.keys(frameBuffer.after).forEach(coo => frameBuffer.before[coo] = frameBuffer.after[coo]);
        frameBuffer.after = {};
        stack.forEach(coo => frameBuffer.after[coo] = data[coo]);
    }
    const chance = Math.random() * INITIAL_VALUE;
    const cooToExplode = stack.filter(coo => (data[coo] || 0) > chance)[0];
    const index = stack.indexOf(cooToExplode);
    return {
        data: updateDataAtCoo(data, stack.splice(index === -1 ? 0 : index, 1)[0]),
        coo: cooToExplode
    };
}

function updateDataAtCoo(data: Data, cooToExplode: string): Data {
    const valueToDecrease = data[cooToExplode] || 0;
    const position = getPosition(cooToExplode);
    const coos = [
        { x: position.x, y: position.y + 1 },
        { x: position.x, y: position.y - 1 },
        { x: position.x + 1, y: position.y },
        { x: position.x - 1, y: position.y }
    ]
        .map(getKey)
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
