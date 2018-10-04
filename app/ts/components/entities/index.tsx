import * as React from 'react';
import { Vector2 } from 'three';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { clampByMax, getRandomArrayElement } from '~/utils';
import { MountAndInit } from '../mount-and-init';
import { Body } from '../body';


type Data = Coobject<number>; // coo -> color

interface IStore {
    data: Data;
}

const Store: IStore = observable({ data: {} });

const updateEntities = action((data: Data) => {
    Store.data = { ...Store.data, ...data };
});


interface Coo {
    x: number;
    y: number;
}

const ConnectedEntities = observer(() => {
    const { data } = Store;
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
                        onEveryTick={() => i < 20 && update(data)}
                    />
                );
            })}
        </group>
    );
});

function getNonEmptyCoordinates(data: Data): string[] {
    return Object.keys(data).filter(coo => data[coo] !== undefined);
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

let stack: string[] = [];

function update(data: Data) {
    if (stack.length === 0) {
        stack = getNonEmptyCoordinates(data);
        return;
    }
    const chance = Math.random();
    const indicesToDelete = stack.map((coo, index) => ({ coo, index }))
        .filter(o => (data[o.coo] || 0) / INITIAL_COLOR > chance)
        .map(o => o.index);
    const cooToExplode = stack.splice(getRandomArrayElement(indicesToDelete), 1)[0];
    const colorToDecrease = data[cooToExplode];
    if (colorToDecrease === undefined) {
        return;
    }
    const position = getPosition(cooToExplode);
    const coo1 = getKey({ x: position.x, y: position.y + 1 });
    const coo2 = getKey({ x: position.x, y: position.y - 1 });
    const coo3 = getKey({ x: position.x + 1, y: position.y });
    const coo4 = getKey({ x: position.x - 1, y: position.y });
    const c1 = data[coo1];
    const c2 = data[coo2];
    const c3 = data[coo3];
    const c4 = data[coo4];
    updateEntities({
        [cooToExplode]: undefined,
        [coo1]: c1 === undefined ? colorToDecrease / 2 : clampByMax(c1 + colorToDecrease / 2, 256),
        [coo2]: c2 === undefined ? colorToDecrease / 2 : clampByMax(c2 + colorToDecrease / 2, 256),
        [coo3]: c3 === undefined ? colorToDecrease / 2 : clampByMax(c3 + colorToDecrease / 2, 256),
        [coo4]: c4 === undefined ? colorToDecrease / 2 : clampByMax(c4 + colorToDecrease / 2, 256)
    });
}


type Props = PositionProps;

const INITIAL_COLOR = 256;

export function Entities(props: Props) {
    return (
        <MountAndInit
            component={<ConnectedEntities />}
            onMount={() => updateEntities({
                [getKey(props.position)]: INITIAL_COLOR
            })}
        />
    );
}

function getKey(position: Coo): string {
    return `${position.x}${DELIMITER}${position.y}`;
}
