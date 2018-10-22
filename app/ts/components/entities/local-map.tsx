import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { vectorsAreEqual } from '~/utils';
import { getPositionByCoo, getColor, getRGB } from './utils';
import { Position } from '~/types';
import { MountAndInit } from '../mount-and-init';
import { Cube } from '../cube';
import { LOCAL_WIDTH, YELLOW_COLOR, INITIAL_VALUE, MAX_PRESSURE_PER_FRAME } from './constants';


interface Props {
    position: Position;
    parentPosition: Position;
    isSelected: boolean;
    count: number;
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
            depth={
                count > 0 ?
                    LOCAL_WIDTH * count / INITIAL_VALUE :
                    LOCAL_WIDTH * MAX_PRESSURE_PER_FRAME
            }
            color={getRGB(isSelected && count > 0 ? YELLOW_COLOR : getColor(count))}
            recieveLight={count > 0}
        />
    );
}


const LocalMapConnected = observer(() => {
    const { local, showNegative, selectedObjectPosition, currentCoo } = Store.state;
    return (
        <group name="local-map">
            {Object.keys(local).map((parentCoo, i) => {
                const localData = local[parentCoo] || {};
                return Object.keys(localData).map((coo, j) => {
                    const position = getPositionByCoo(coo);
                    const count = localData[coo] || 0;
                    if (showNegative === false && count < 0) {
                        return null;
                    }
                    return (
                        <LocalMapElement
                            key={`${i}-${j}`}
                            position={position}
                            parentPosition={getPositionByCoo(parentCoo)}
                            isSelected={selectedObjectPosition !== null && parentCoo === currentCoo
                                && vectorsAreEqual(selectedObjectPosition, position, 0.3)}
                            count={count}
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
