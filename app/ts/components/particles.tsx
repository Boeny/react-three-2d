import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Vector3 } from 'three';
import { Parametric } from './parametric';


const PARTICLES_IN_COLUMN = 1;// all
const PARTICLES_IN_ROW = 500;// count in the row
const PARTICLES_WIDTH = 5;// units
const count = PARTICLES_IN_COLUMN * PARTICLES_IN_ROW;

export function Particles() {
    const particles: JSX.Element[] = [];
    for (let i = 0; i < count; i += 1) {
        particles.push(
            <Particle
                key={i}
                x={i % PARTICLES_IN_ROW}
                y={Math.floor(i / PARTICLES_IN_ROW)}
            />
        );
    }
    return (
        <group position={new Vector3(-250 * PARTICLES_WIDTH, -80 * PARTICLES_WIDTH, 0)}>
            {particles}
        </group>
    );
}


interface Props {
    x: number;
    y: number;
}

function Particle(props: Props) {
    return (
        <Parametric
            position={new Vector3(props.x * PARTICLES_WIDTH, props.y * PARTICLES_WIDTH, 0)}
            slices={1}
            stacks={1}
            parametricFunction={(u, v) => pointInTheQuad(u, v, PARTICLES_WIDTH)}
        />
    );
}

function pointInTheQuad(u: number, v: number, length: number): Vector3 {
    return new Vector3(
        u * length,
        v * length,
        0
    );
}


@observer
export class Body extends React.Component {

    @observable
    x: number = 0;

    @observable
    y: number = 0;

    @action
    update() {
        this.y += 1;
    }

    componentDidMount() {
        this.update();
    }

    render() {
        return (
            <Particle
                x={this.x}
                y={this.y}
            />
        );
    }
}
