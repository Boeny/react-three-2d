import * as React from 'react';
import { Vector2 } from 'three';
import { clampByMax } from '~/utils';
import { Body } from '../body';


interface Coo {
    x: number;
    y: number;
}

type Props = PositionProps;

interface State {
    data: Coobject<number>; // coo -> color
}

export class Entities extends React.Component<Props, State> {

    DELIMITER = '|';
    INITIAL_COLOR = 256;

    constructor(props: Props) {
        super(props);
        const { position } = props;
        const coo = this.getKey(position);
        this.state = {
            data: { [coo]: this.INITIAL_COLOR }
        };
    }

    getKey = (position: Coo): string => {
        return `${position.x}${this.DELIMITER}${position.y}`;
    }

    getColor = (color: number): string => {
        const c = clampByMax(Math.round(color), 255);
        return `rgb(${c}, ${c}, ${c})`;
    }

    getPosition = (coo: string): Coo => {
        const position = coo.split(this.DELIMITER).map(v => parseInt(v, 10))
            .filter(v => !isNaN(v));
        if (position.length !== 2) {
            console.warn('Entities.getPosition: input string = 2 coordinates splitted by |');
            return { x: 0, y: 0 };
        }
        return {
            x: position[0],
            y: position[1]
        };
    }

    onUpdate = (coo: string) => {
        const { data } = this.state;
        if (Object.keys(data).length > 16) {
            return;
        }
        const color = (data[coo] || 0) / 4;
        const position = this.getPosition(coo);
        this.setState(state => ({
            ...state,
            ...this.getNewData(color, { x: position.x, y: position.y + 1 }),
            ...this.getNewData(color, { x: position.x, y: position.y - 1 }),
            ...this.getNewData(color, { x: position.x + 1, y: position.y }),
            ...this.getNewData(color, { x: position.x - 1, y: position.y })
        }));
    }

    getNewData = (color: number, position: Coo): State['data'] => {
        const { data } = this.state;
        const coo = this.getKey(position);
        const existingColor = data[coo];
        if (existingColor !== undefined) {
            return { [coo]: clampByMax(color + existingColor, 256) };
        }
        console.log(coo);
        return { [coo]: color };
    }

    render() {
        const { data } = this.state;
        return (
            <group>
                {Object.keys(data).map((coo, i) => {
                    const position = this.getPosition(coo);
                    return (
                        <Body
                            key={i}
                            color={this.getColor(data[coo] || 0)}
                            isMovable={true}
                            position={new Vector2(position.x, position.y)}
                            onEveryTick={() => this.onUpdate(coo)}
                        />
                    );
                })}
            </group>
        );
    }
}
