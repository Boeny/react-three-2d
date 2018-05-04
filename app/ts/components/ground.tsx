import * as React from 'react';
import { Vector2 } from 'three';
import { Stick } from './stick';


const IN_COLUMN_COUNT = 1;// all

const IN_ROW_COUNT = 240;// count in the row

const offset = {
    x: -IN_ROW_COUNT / 2,
    y: 0
};

export function Ground(props: PositionProps) {
    return (
        <Stick
            length={IN_COLUMN_COUNT * IN_ROW_COUNT}
            getPosition={i => new Vector2(i + offset.x, offset.y).add(props.position || new Vector2())}
        />
    );
}
