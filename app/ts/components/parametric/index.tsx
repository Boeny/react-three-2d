import * as React from 'react';
import { Color, VertexColors, Vector3, Texture } from 'three';
import { SHOW_AS_WIREFRAME } from '~/constants';


interface Props {
    position: Vector3;
    slices: number;
    stacks: number;
    parametricFunction: (u: number, v: number, v3: Vector3) => Vector3;
    color?: string;
    texture?: Texture;
    transparent?: boolean;
    recieveLight?: boolean;
    name?: string;
}

export function Parametric(props: Props) {
    const {
        color, position, slices, stacks, parametricFunction, texture, transparent, recieveLight,
        name
    } = props;
    return (
        <mesh position={position} name={name}>
            <parametricGeometry
                parametricFunction={parametricFunction}
                slices={slices}
                stacks={stacks}
            />
            {recieveLight ?
                <meshLambertMaterial
                    wireframe={SHOW_AS_WIREFRAME}
                    color={color ? new Color(color) : '#000000'}
                    vertexColors={VertexColors}
                    map={texture}
                    transparent={transparent}
                />
                :
                <meshBasicMaterial
                    wireframe={SHOW_AS_WIREFRAME}
                    color={color ? new Color(color) : '#000000'}
                    vertexColors={VertexColors}
                    map={texture}
                    transparent={transparent}
                />
            }
        </mesh>
    );
}
