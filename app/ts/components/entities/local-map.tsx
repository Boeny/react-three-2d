import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { getPositionByCoo } from './utils';
import { Position } from '~/types';
import { MountAndInit } from '../mount-and-init';
import { Cube } from '../cube';
import { LOCAL_WIDTH } from './constants';


type Item = { coo: string, count: number };

interface Props {
    showNegative: boolean;
    position: Position;
    data: Item[];
}

function LocalMapComponent(props: Props) {
    const { position, data } = props;
    return (
        <group>
            {data.map(({ coo, count }, i) => {
                const localPos = getPositionByCoo(coo);
                return (
                    <Cube
                        key={i}
                        position={new Vector3(
                            position.x + (localPos.x + 0.5) * LOCAL_WIDTH,
                            position.y + (localPos.y + 0.5) * LOCAL_WIDTH,
                            0
                        )}
                        width={LOCAL_WIDTH}
                        height={LOCAL_WIDTH}
                        depth={LOCAL_WIDTH / 2}
                        color={count > 0 ? '#ffffff' : '#ff0000'}
                        recieveLight={count > 0}
                    />
                );
            })}
        </group>
    );
}


const List = observer(() => {
    const { local, showNegative, data } = Store.state;
    return (
        <group>
            {Object.keys(local).map((coo, i) => {
                const count = data[coo] || 0;
                if (showNegative === false && count < 0) {
                    return null;
                }
                return (
                    <LocalMapComponent
                        key={i}
                        showNegative={showNegative}
                        position={getPositionByCoo(coo)}
                        data={getLocalMapData(local[coo] || {}, count)}
                    />
                );
            })}
        </group>
    );
});

function getLocalMapData(data: Coobject<string>, count: number): Item[] {
    return Object.keys(data).map(coo => ({ coo, count }));
}


export const LocalMap = observer(() => {
    const { mode } = Store.state;
    if (mode < 2) {
        return null;
    }
    return (
        <MountAndInit
            component={<List />}
            onMount={() => Store.initLocal()}
        />
    );
});
