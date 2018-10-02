import * as React from 'react';
import { Vector2 } from 'three';
import { clampByMax } from '~/utils';
import { Body } from '../body';


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
        const coo = this.getKey([position.x, position.y]);
        this.state = {
            data: { [coo]: this.INITIAL_COLOR }
        };
    }

    getKey = (position: number[]): string => {
        return `${position[0]}${this.DELIMITER}${position[1]}`;
    }

    getColor = (color: number): string => {
        const c = clampByMax(Math.round(color), 255);
        return `rgb(${c}, ${c}, ${c})`;
    }

    getPosition = (coo: string): number[] => {
        return coo.split(this.DELIMITER).map(parseInt);
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
            ...this.getNewData(color, [position[0], position[1] + 1]),
            ...this.getNewData(color, [position[0], position[1] - 1]),
            ...this.getNewData(color, [position[0] + 1, position[1]]),
            ...this.getNewData(color, [position[0] - 1, position[1]])
        }));
    }

    getNewData = (color: number, position: number[]): State['data'] => {
        const { data } = this.state;
        const coo = this.getKey(position);
        const existColor = data[coo];
        if (existColor) {
            return { [coo]: clampByMax(color + existColor, 256) };
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
                            position={new Vector2(position[0], position[1])}
                            onEveryTick={() => this.onUpdate(coo)}
                        />
                    );
                })}
            </group>
        );
    }
}
