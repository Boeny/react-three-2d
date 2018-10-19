import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { vectorsAreEqual } from '~/utils';
import { getPositionByCoo } from './utils';
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
    const positiveColor = isSelected ? getRGB(YELLOW_COLOR) : getRGB(getColor(count, false));
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
            color={count > 0 ? positiveColor : '#ff0000'}
            recieveLight={count > 0}
        />
    );
}

function getRGB(c: Color): string {
    return `rgb(${c.r}, ${c.g}, ${c.b})`;
}

interface Color {
    r: number;
    g: number;
    b: number;
}
function getColor(color: number, showNegative: boolean): Color {
    const c = Math.round(color * 255 / INITIAL_VALUE);
    return c >= 0 ? { r: c, g: c, b: c } : { r: showNegative ? -c : 0, g: 0, b: 0 };
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
