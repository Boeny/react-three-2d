import * as React from 'react';
import { Vector2 } from 'three';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { clampByMax, getRandomArrayElement, createArray } from '~/utils';
import { MountAndInit } from '../mount-and-init';
import { Body } from '../body';


type Data = Coobject<number>; // coo -> color

interface IStore {
    data: Data;
}

const Store: IStore = observable({ data: {} });

const setData = action((data: Data) => {
    Store.data = data;
});


interface Coo {
    x: number;
    y: number;
}

const MERGES_PER_FRAME = 50;

const ConnectedEntities = observer(() => {
    const data = toJS(Store.data);
    return (
        <group>
            {getNonEmptyCoordinates(data).map((coo, i) => {
                const position = getPosition(coo);
                const color = data[coo] || 0;
                return (
                    <Body
                        key={`${coo}-${i}-${color}`}
                        isMovable={true}
                        color={getColor(color)}
                        position={new Vector2(position.x, position.y)}
                        onEveryTick={() => i === 0 && update(data, MERGES_PER_FRAME)}
                    />
                );
            })}
        </group>
    );
});

function getNonEmptyCoordinates(data: Data): string[] {
    return Object.keys(data).filter(coo => !!data[coo]);
}

const DELIMITER = '|';

function getPosition(coo: string): Coo {
    const position = coo.split(DELIMITER).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    if (position.length !== 2) {
        console.warn(`Entities.getPosition: input string = 2 coordinates splitted by "${DELIMITER}"`);
        return { x: 0, y: 0 };
    }
    return {
        x: position[0],
        y: position[1]
    };
}

function getColor(color: number): string {
    const c = clampByMax(Math.round(color), 255);
    return `rgb(${c}, ${c}, ${c})`;
}

function update(data: Data, count: number) {
    setData(createArray(count).reduce(updateAtPosition, data));
}

let stack: string[] = [];

function updateAtPosition(data: Data): Data {
    if (stack.length === 0) {
        data['0|0'] = INITIAL_COLOR;
        stack = getNonEmptyCoordinates(data);
    }
    const chance = Math.random();
    const indicesToDelete = stack.map((coo, index) => ({ coo, index }))
        .filter(o => (data[o.coo] || 0) / INITIAL_COLOR > chance)
        .map(o => o.index);
    const cooToExplode = stack.splice(getRandomArrayElement(indicesToDelete), 1)[0];

    stack.splice(getRandomArrayElement(indicesToDelete), 1)[0];
    stack.splice(getRandomArrayElement(indicesToDelete), 1)[0];

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

    const resultColors = decreaseColors(coos.map(o => o.color), colorToDecrease);
    if (resultColors.length !== 4) {
        console.warn('resultColors length must be 4!');
        return data;
    }
    coos.forEach((o, i) => {
        if (resultColors[i] < 1) {
            delete data[o.coo];
        } else {
            data[o.coo] = resultColors[i];
        }
    });
    const resultColor = resultColors[resultColors.length - 1];
    if (resultColor < 1) {
        delete data[cooToExplode];
    } else {
        data[cooToExplode] = resultColor;
    }
    return data;
}

function decreaseColors(sortedColors: number[], colorToDecrease: number): number[] {
    const filtered = sortedColors.filter(c => colorToDecrease - c > 0);
    if (filtered.length === 0) {
        return sortedColors;
    }
    const diff = (colorToDecrease - filtered[0]) / (filtered.length + 1);
    return [
        ...sortedColors.filter(c => colorToDecrease - c <= 0),
        ...decreaseColors(filtered.map(c => c + diff), filtered[0] + diff)
    ];
}


type Props = PositionProps;

const INITIAL_COLOR = 512;

export function Entities(props: Props) {
    return (
        <MountAndInit
            component={<ConnectedEntities />}
            onMount={() => setData({ [getKey(props.position)]: INITIAL_COLOR })}
        />
    );
}

function getKey(position: Coo): string {
    return `${position.x}${DELIMITER}${position.y}`;
}
