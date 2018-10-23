import * as React from 'react';
import { Vector3, Mesh } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { vectorsAreEqual } from '~/utils';
import { getPositionByCoo, getColor, getRGB } from './utils';
import { Position } from '~/types';
import { MountAndInit } from '../mount-and-init';
import { Union } from '../csg';
import { CubeMesh, Cube } from '../cube';
import { LOCAL_WIDTH, YELLOW_COLOR, INITIAL_VALUE, MAX_PRESSURE_PER_FRAME } from './constants';


interface Props {
    position: Position;
    parentPosition: Position;
    isSelected: boolean;
    count: number;
}

function LocalMapElementMesh(props: Props): Mesh {
    const { parentPosition, position, isSelected, count } = props;
    return (
        CubeMesh({
            position: new Vector3(
                parentPosition.x + (position.x + 0.5) * LOCAL_WIDTH,
                parentPosition.y + (position.y + 0.5) * LOCAL_WIDTH,
                0
            ),
            width: LOCAL_WIDTH,
            height: LOCAL_WIDTH,
            depth:  count > 0 ?
                LOCAL_WIDTH * count / INITIAL_VALUE :
                LOCAL_WIDTH * MAX_PRESSURE_PER_FRAME,
            color: getRGB(isSelected && count > 0 ? YELLOW_COLOR : getColor(count)),
            receiveLight: count > 0
        })
    );
}


function LocalMapElement(props: Props) {
    const { parentPosition, position, isSelected, count } = props;
    return (
        <Cube
            position={new Vector3(
                parentPosition.x + (position.x + 0.5) * LOCAL_WIDTH,
                parentPosition.y + (position.y + 0.5) * LOCAL_WIDTH,
                0
            )}
            width={LOCAL_WIDTH}
            height={LOCAL_WIDTH}
            depth={count > 0 ?
                LOCAL_WIDTH * count / INITIAL_VALUE :
                LOCAL_WIDTH * MAX_PRESSURE_PER_FRAME}
            color={getRGB(isSelected && count > 0 ? YELLOW_COLOR : getColor(count))}
            receiveLight={count > 0}
        />
    );
}


export const LocalMapUnionConnected = observer(() => {
    const { local, showNegative, selectedObjectPosition, currentCoo } = Store.state;
    return (
        <group name="local-map">
            <Union
                components={(
                    Object.keys(local).map(parentCoo => {
                        const localData = local[parentCoo] || {};
                        return Object.keys(localData).map(coo => {
                            const count = localData[coo] || 0;
                            if (showNegative === false && count < 0) {
                                return null;
                            }
                            const position = getPositionByCoo(coo);
                            return (
                                LocalMapElementMesh({
                                    count,
                                    position,
                                    parentPosition: getPositionByCoo(parentCoo),
                                    isSelected: selectedObjectPosition !== null && parentCoo === currentCoo
                                        && vectorsAreEqual(selectedObjectPosition, position, 0.3)
                                })
                            );
                        });
                    })
                )}
            />
        </group>
    );
});


export const LocalMapConnected = observer(() => {
    const { local, showNegative, selectedObjectPosition, currentCoo } = Store.state;
    return (
        <group name="local-map">
            {Object.keys(local).map(parentCoo => {
                const localData = local[parentCoo] || {};
                return Object.keys(localData).map(coo => {
                    const count = localData[coo] || 0;
                    if (showNegative === false && count < 0) {
                        return null;
                    }
                    const position = getPositionByCoo(coo);
                    return (
                        LocalMapElement({
                            count,
                            position,
                            parentPosition: getPositionByCoo(parentCoo),
                            isSelected: selectedObjectPosition !== null && parentCoo === currentCoo
                                && vectorsAreEqual(selectedObjectPosition, position, 0.3)
                        })
                    );
                });
            })}
        </group>
    );
});


export const LocalMap = observer(() => {
    const { mode } = Store.state;
    if (mode < 2) {
        return null;
    }
    return (
        <MountAndInit
            component={<LocalMapConnected />}
            onMount={() => Store.initLocal()}
        />
    );
});
