import * as React from 'react';
import { Vector3 } from 'three';
import { observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import { setDefaultData, getNonEmptyCoordinates, getPosition, getColor, getNewData } from './utils';
import { MountAndInit } from '../mount-and-init';
import { Quad } from '../quad';
import { Store as movable } from '../movable/store';
import { Store as events } from '../events/store';
import { WIDTH_SCALE } from '~/constants';


type Data = Coobject<number>; // coo -> color

interface IStore {
    state: {
        data: Data;
        mode: number;
    };
    setData: (data: Data) => void;
    nextStep: () => void;
    setMode: (mode: number) => void;
    nextMode: () => void;
}

export const Store: IStore = {
    state: observable({
        data: {},
        mode: 0
    }),
    setData(data: Data) {
        runInAction(() => this.state.data = data);
    },
    nextStep() {
        this.setData(getNewData(toJS(this.state.data), this.state.mode));
    },
    setMode(mode: number) {
        runInAction(() => this.state.mode = mode);
    },
    nextMode() {
        console.log(this.state.mode + 1);
        this.setMode(this.state.mode + 1);
    }
};


const ConnectedEntities = observer(() => {
    const { data } = Store.state;
    return (
        <group>
            {getNonEmptyCoordinates(data).map((coo, i) => {
                const position = getPosition(coo);
                const color = data[coo] || 0;
                return (
                    <Quad
                        key={`${coo}-${i}-${color}`}
                        position={new Vector3(position.x, position.y, 0)}
                        width={WIDTH_SCALE}
                        height={WIDTH_SCALE}
                        color={getColor(color)}
                    />
                );
            })}
        </group>
    );
});


export function Entities(_: PositionProps) {
    return (
        <MountAndInit
            component={<ConnectedEntities />}
            onMount={() => {
                movable.add({ onEveryTick });
                Store.setData(setDefaultData({}));
            }}
        />
    );
}

function onEveryTick() {
    if (events.state.stepMode === false) {
        Store.nextStep();
    }
}
