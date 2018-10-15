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
enum Mode {
    default,
    next
}

interface IStore {
    isBlocked: boolean;
    state: {
        data: Data;
        mode: Mode;
    };
    setData: (data: Data) => void;
    nextStep: () => void;
    setMode: (mode: Mode) => void;
    nextMode: () => void;
}

export const Store: IStore = {
    isBlocked: false,
    state: observable({
        data: {},
        mode: Mode.default
    }),
    setData(data: Data) {
        runInAction(() => this.state.data = data);
    },
    nextStep() {
        this.setData(getNewData(toJS(this.state.data)));
    },
    setMode(mode: Mode) {
        runInAction(() => this.state.mode = mode);
    },
    nextMode() {
        this.setMode(Mode.next);
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
