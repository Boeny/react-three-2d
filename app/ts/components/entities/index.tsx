import * as React from 'react';
import { Vector2 } from 'three';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { clampByMax } from '~/utils';
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


const DELIMITER = '|';

interface Coo {
    x: number;
    y: number;
}

const ConnectedEntities = observer(() => {
    const { data } = Store;
    return (
        <group>
            {Object.keys(data).filter(coo => data[coo] !== undefined).map((coo, i) => {
                const position = getPosition(coo);
                const color = data[coo] || 0;
                return (
                    <Body
                        key={i}
                        isMovable={true}
                        color={getColor(color)}
                        position={new Vector2(position.x, position.y)}
                        onEveryTick={() => update(coo, color, position, data)}
                    />
                );
            })}
        </group>
    );
});

function getPosition(coo: string): Coo {
    const position = coo.split(DELIMITER).map(v => parseInt(v, 10)).filter(v => !isNaN(v));
    if (position.length !== 2) {
        console.warn('Entities.getPosition: input string = 2 coordinates splitted by |');
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

function update(_: string, color: number, position: Coo, data: Data) {
    updateEntities({
        // [coo]: undefined,
        ...getNewData(color, { x: position.x, y: position.y + 1 }, data),
        ...getNewData(color, { x: position.x, y: position.y - 1 }, data),
        ...getNewData(color, { x: position.x + 1, y: position.y }, data),
        ...getNewData(color, { x: position.x - 1, y: position.y }, data)
    });
}

function getNewData(oldColor: number, position: Coo, data: Data): Data {
    const coo = getKey(position);
    const newColor = oldColor / 2;
    const existingColor = data[coo];
    return {
        [coo]: existingColor === undefined ? newColor : clampByMax(existingColor + newColor, 256)
    };
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
