import * as React from 'react';
import { Vector2 } from 'three';
import { observable, action, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { getDefaultData, getNonEmptyCoordinates, getPosition, getColor, getNewData } from './utils';
import { MountAndInit } from '../mount-and-init';
import { Body } from '../body';


type Data = Coobject<number>; // coo -> color

interface IStore {
    data: Data;
}

const Store: IStore = observable({ data: {} });

const setData = action((data: Data) => {
    Store.data = data;
});


interface ConnectedProps {
    onUpdate: (data: Data) => void;
}

const ConnectedEntities = observer((props: ConnectedProps) => {
    const { onUpdate } = props;
    const data = toJS(Store.data);
    return (
        <group>
            {getNonEmptyCoordinates(data).map((coo, i) => {
                const position = getPosition(coo);
                const color = data[coo] || 0;
                return (
                    <Body
                        key={`${coo}-${i}-${color}`}
                        isMovable={true}
                        borderWidth={0}
                        color={getColor(color)}
                        position={new Vector2(position.x, position.y)}
                        onEveryTick={() => i === 0 && onUpdate(getNewData(data))}
                    />
                );
            })}
        </group>
    );
});


type Props = PositionProps;

export function Entities(props: Props) {
    return (
        <MountAndInit
            component={<ConnectedEntities onUpdate={setData} />}
            onMount={() => setData(getDefaultData(props.position))}
        />
    );
}
