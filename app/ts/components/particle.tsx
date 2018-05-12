import * as React from 'react';
import { Vector2, Vector3 } from 'three';
import { setCollider, delCollider } from './colliders/utils';
import { Parametric } from './parametric';
import { WIDTH_SCALE, Z_INDEX_STEP } from '~/constants';


interface Props {
    x: number;
    y: number;
    color: string;
    width?: number;
    height?: number;
    hasCollider?: boolean;
    name?: string;
    zIndex?: number;
}

export class Particle extends React.Component<Props> {

    componentDidMount() {
        const { x, y, color, hasCollider, name } = this.props;
        if (hasCollider) {
            setCollider({
                name,
                color,
                position: { x, y }
            });
        }
    }

    componentWillUnmount() {
        if (this.props.hasCollider) {
            delCollider(this.props);
        }
    }

    render() {
        const { color, zIndex } = this.props;
        const width = (this.props.width || 1) * WIDTH_SCALE;
        const height = (this.props.height || this.props.width || 1) * WIDTH_SCALE;
        if (width <= 0 && height <= 0) {
            return null;
        }
        const x = this.props.x * WIDTH_SCALE;
        const y = this.props.y * WIDTH_SCALE;
        const z = zIndex ? zIndex * Z_INDEX_STEP : 0;
        return (
            <group>
                <Quad
                    x={x}
                    y={y}
                    z={z}
                    width={width}
                    height={height}
                    color={'#000000'}
                />
                <Quad
                    x={x + 0.01}
                    y={y + 0.01}
                    z={z + Z_INDEX_STEP}
                    width={width - 0.02}
                    height={height - 0.02}
                    color={color}
                />
            </group>
        );
    }
}


interface QuadProps {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    color: string;
}

function Quad(props: QuadProps) {
    return (
        <Parametric
            position={new Vector2(props.x, props.y)}
            slices={1}
            stacks={1}
            parametricFunction={(u, v) => pointInTheQuad(u, v, props.width, props.height, props.z)}
            color={props.color}
        />
    );
}

function pointInTheQuad(u: number, v: number, width: number, height: number, z: number): Vector3 {
    return new Vector3(
        u * width,
        v * height,
        z
    );
}
