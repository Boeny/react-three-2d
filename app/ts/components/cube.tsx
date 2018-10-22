import * as React from 'react';
import {
    Vector3, Color, VertexColors, Texture, Mesh, BoxGeometry, MeshBasicMaterial, MeshLambertMaterial,
    MeshPhongMaterial
} from 'three';
import { SHOW_AS_WIREFRAME } from '~/constants';


interface Props {
    position: Vector3;
    width: number;
    height: number;
    depth: number;
    color?: string;
    texture?: Texture;
    transparent?: boolean;
    receiveLight?: boolean;
    withShadows?: boolean;
    name?: string;
    onRef?: (m: Mesh | null) => void;
}

export function Cube(props: Props) {
    const {
        position, width, height, depth, color, texture, transparent, receiveLight, withShadows,
        name, onRef
    } = props;
    return (
        <mesh
            position={position}
            name={name}
            ref={onRef}
            castShadow={!!withShadows}
            receiveShadow={!!withShadows}
        >
            <boxGeometry
                width={width}
                height={height}
                depth={depth}
                widthSegments={1}
                heightSegments={1}
                depthSegments={1}
            />
            {withShadows ?
                <meshLambertMaterial
                    wireframe={SHOW_AS_WIREFRAME}
                    color={color ? new Color(color) : '#000000'}
                    vertexColors={VertexColors}
                    map={texture}
                    transparent={transparent}
                />
            :
                    (receiveLight ?
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
                    )
            }
        </mesh>
    );
}


export function CubeMesh(props: Props): Mesh {
    const { position, width, height, depth, color, receiveLight, withShadows } = props;
    const result = new Mesh(
        new BoxGeometry(width, height, depth),
        withShadows ?
            new MeshPhongMaterial({
                wireframe: SHOW_AS_WIREFRAME,
                color: color ? new Color(color) : '#000000',
                vertexColors: VertexColors
            })
        :
            (
                receiveLight ?
                    new MeshLambertMaterial({
                        wireframe: SHOW_AS_WIREFRAME,
                        color: color ? new Color(color) : '#000000',
                        vertexColors: VertexColors
                    })
                :
                    new MeshBasicMaterial({
                        wireframe: SHOW_AS_WIREFRAME,
                        color: color ? new Color(color) : '#000000',
                        vertexColors: VertexColors
                    })
            )
    );
    result.position.x = position.x;
    result.position.y = position.y;
    result.position.z = position.z;
    result.updateMatrix();
    result.castShadow = !!withShadows;
    result.receiveShadow = !!withShadows;
    return result;
}
