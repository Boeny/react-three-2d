import { createArray } from '~/utils';


const INITIAL_VALUE = 200;
const DELIMITER = '|';
const AREA_WIDTH = 20;
const DEFAULT_COOS = createArray(10).map(() => getKey({ x: getCoo(), y: getCoo() }));
const MAX_PRESSURE_PER_FRAME = 40;
const MAX_UPDATE_ITERATIONS = 10000;


type Data = Coobject<number>; // coo -> color

interface Coo {
    x: number;
    y: number;
}

function getCoo() {
    return Math.floor(Math.random() * AREA_WIDTH);
}

export function getDefaultData(position: Coo): Data {
    return DEFAULT_COOS.reduce(
        (result, coo) => {
            const pos = getPosition(coo);
            result[getKey({ x: position.x + pos.x, y: position.y + pos.y })] = INITIAL_VALUE;
            return result;
        },
        {} as Data
    );
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

export function getColor(color: number): string {
    const c = Math.round(color * 255 / INITIAL_VALUE);
    return `rgb(${c}, ${c}, ${c})`;
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
    DEFAULT_COOS.forEach(coo => {
        setDataAtCoo(data, coo, INITIAL_VALUE);
        // setDataAtCoo(data, coo.negative, -INITIAL_VALUE);
    });
    stack = getNonEmptyCoordinates(data);
    frameBuffer.before = {};
    getNonEmptyCoordinates(frameBuffer.after)
        .forEach(coo => frameBuffer.before[coo] = frameBuffer.after[coo]);
    frameBuffer.after = {};
    stack.forEach(coo => frameBuffer.after[coo] = data[coo]);
    let result = data;
    let i = 0;
    for (; stack.length > 0 && i < MAX_UPDATE_ITERATIONS; i += 1) {
        const chance = Math.random() * INITIAL_VALUE;
        const cooToExplode = stack.filter(coo => (data[coo] || 0) > chance)[0];
        const index = stack.indexOf(cooToExplode);
        if (index > -1) {
            result = updateDataAtCoo(result, index);
        } else {
            break;
        }
    }
    if (i === MAX_UPDATE_ITERATIONS) {
        console.warn('iterations limit has achieved!');
    }
    return result;
}

function updateDataAtCoo(data: Data, index: number): Data {
    const cooToExplode = stack[index];
    stack.splice(index, 1);
    const valueToDecrease = data[cooToExplode];
    if (!valueToDecrease) {
        return {};
    }
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
    if (value < 1) {
        delete data[coo];
    } else {
        data[coo] = value;
    }
}
