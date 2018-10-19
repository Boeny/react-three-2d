import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { vectorsAreEqual } from '~/utils';
import { getPositionByCoo } from './utils';
import { Position } from '~/types';
import { MountAndInit } from '../mount-and-init';
import { Cube } from '../cube';
import { LOCAL_WIDTH, YELLOW_COLOR } from './constants';


interface Props {
    position: Position;
    parentPosition: Position;
    isSelected: boolean;
    isPositive: boolean;
}

function LocalMapElement(props: Props) {
    const { parentPosition, position, isPositive, isSelected } = props;
    const positiveColor = isSelected ?
            `rgb(${YELLOW_COLOR.r}, ${YELLOW_COLOR.g}, ${YELLOW_COLOR.b})` : '#ffffff';
    return (
        <Cube
            position={new Vector3(
                parentPosition.x + (position.x + 0.5) * LOCAL_WIDTH,
                parentPosition.y + (position.y + 0.5) * LOCAL_WIDTH,
                0
            )}
            width={LOCAL_WIDTH}
            height={LOCAL_WIDTH}
            depth={LOCAL_WIDTH / 2}
            color={isPositive ? positiveColor : '#ff0000'}
            recieveLight={isPositive}
        />
    );
}


const LocalMapConnected = observer(() => {
    const { local, showNegative, data, selectedObjectPosition, currentCoo } = Store.state;
    return (
        <group name="local-map">
            {Object.keys(local).map((parentCoo, i) => {
                const parentCount = data[parentCoo] || 0;
                if (showNegative === false && parentCount < 0) {
                    return null;
                }
                return Object.keys(local[parentCoo] || {}).map((coo, j) => {
                    const position = getPositionByCoo(coo);
                    if (selectedObjectPosition !== null && parentCoo === currentCoo) {
                        console.log(position);
                    }
                    return (
                        <LocalMapElement
                            key={`${i}-${j}`}
                            position={position}
                            parentPosition={getPositionByCoo(parentCoo)}
                            isSelected={selectedObjectPosition !== null && parentCoo === currentCoo
                                && vectorsAreEqual(selectedObjectPosition, position, 0.3)}
                            isPositive={parentCount > 0}
                        />
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
