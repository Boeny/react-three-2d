import { createArray } from '~/utils';


const MERGES_PER_FRAME = 50;
const INITIAL_COLOR = 512;
const DELIMITER = '|';
const DEFAULT_COOS = ['0|0'];
const MAX_PRESSURE_PER_FRAME = 20;
const COUNTER_RATE = 10;
const COLOR_STEP_BY_COUNTER = 10;

type Data = Coobject<number>; // coo -> color

interface Coo {
    x: number;
    y: number;
}

export function getDefaultData(position: Coo): Data {
    return DEFAULT_COOS.reduce(
        (result, coo) => {
            const pos = getPosition(coo);
            result[getKey({ x: position.x + pos.x, y: position.y + pos.y })] = INITIAL_COLOR;
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
    const c = Math.round(color * 255 / INITIAL_COLOR);
    return `rgb(${c}, ${c}, ${c})`;
}


let counter = 1;

function changeColorByCounter(color: number): number {
    if (counter > 0 && counter < COUNTER_RATE) {
        counter += 1;
        if (color < INITIAL_COLOR) {
            return color + COLOR_STEP_BY_COUNTER;
        }
    } else if (counter >= COUNTER_RATE) {
        counter = -1;
    } else if (counter < 0 && counter > -COUNTER_RATE) {
        counter -= 1;
        if (color > 0) {
            return color - COLOR_STEP_BY_COUNTER;
        }
    } else if (counter <= -COUNTER_RATE) {
        counter = 1;
    }
    return color;
}

export function getNewData(data: Data): Data {
    return createArray(MERGES_PER_FRAME).reduce(updateDataAtPosition, data);
}


let stack: Data = {};

function updateDataAtPosition(data: Data): Data {
    const stackCoos = getNonEmptyCoordinates(stack);
    const dataCoos = getNonEmptyCoordinates(data);
    if (stackCoos.length === dataCoos.length) {
        DEFAULT_COOS.forEach(coo => {
            setColor(data, coo, changeColorByCounter(data[coo] || 0));
        });
        stack = {};
    }
    let cooToExplode = DEFAULT_COOS[0];
    const chance = Math.random();
    dataCoos.forEach(coo => {
        if ((data[coo] || 0) / INITIAL_COLOR > chance) {
            stack[coo] = 0;
            cooToExplode = coo;
            return false;
        }
    });
    const colorToDecrease = data[cooToExplode];
    if (!colorToDecrease) {
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
        .map(coo => ({
            coo,
            color: data[coo] || 0
        }))
        .sort((a, b) => b.color - a.color);

    const result = decreaseColors(coos.map(o => o.color), colorToDecrease);
    if (result.data.length !== 4) {
        console.warn('result colors length must be 4!');
        return data;
    }
    coos.forEach((o, i) => setColor(data, o.coo, result.data[i]));
    setColor(data, cooToExplode, result.color);
    return data;
}

type Children = { data: number[], color: number };
function decreaseColors(sortedColors: number[], colorToDecrease: number): Children {
    const filtered = sortedColors.filter(c => colorToDecrease - c > 0);
    if (filtered.length === 0) {
        return { data: sortedColors, color: colorToDecrease };
    }
    const diff = (colorToDecrease - filtered[0]) / (filtered.length + 1);
    if (colorToDecrease - filtered[0] > MAX_PRESSURE_PER_FRAME) {
        return {
            data: [
                ...sortedColors.filter(c => colorToDecrease - c <= 0),
                ...filtered.map(c => c + MAX_PRESSURE_PER_FRAME)
            ],
            color: colorToDecrease - MAX_PRESSURE_PER_FRAME
        };
    }
    const children = decreaseColors(filtered.map(c => c + diff), filtered[0] + diff);
    return {
        data: [
            ...sortedColors.filter(c => colorToDecrease - c <= 0),
            ...children.data
        ],
        color: children.data[children.data.length - 1]
    };
}

function setColor(data: Data, coo: string, color: number) {
    if (color < 1) {
        delete data[coo];
    } else {
        data[coo] = color;
    }
}
