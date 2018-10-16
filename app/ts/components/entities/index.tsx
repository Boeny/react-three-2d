import * as React from 'react';
import { Vector3 } from 'three';
import { observable, runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react';
import {
    setDefaultData, getNonEmptyCoordinates, getPosition, getNewData, getNewValueAtCoo
} from './utils';
import { MountAndInit } from '../mount-and-init';
import { Quad } from '../quad';
import { Store as movable } from '../movable/store';
import { Store as events } from '../events/store';
import { WIDTH_SCALE } from '~/constants';
import { INITIAL_VALUE } from './constants';


type Data = Coobject<number>; // coo -> color

interface IStore {
    state: {
        data: Data;
        mode: number;
        currentCoo: string | null;
        showNegative: boolean;
    };
    setData: (data: Data) => void;
    nextStep: () => void;
    setMode: (mode: number) => void;
    nextMode: () => void;
    toggleNegative: () => void;
}

export const Store: IStore = {
    state: observable({
        data: {},
        mode: 0,
        currentCoo: null,
        showNegative: false
    }),
    setData(data: Data) {
        runInAction(() => this.state.data = data);
    },
    nextStep() {
        runInAction(() => {
            if (this.state.mode > 0) {
                const result = getNewValueAtCoo(toJS(this.state.data));
                this.state.currentCoo = result.coo;
                this.setData(result.data);
            } else {
                this.setData(getNewData(toJS(this.state.data)));
            }
        });
    },
    setMode(mode: number) {
        runInAction(() => this.state.mode = mode);
    },
    nextMode() {
        console.log(this.state.mode + 1);
        this.setMode(this.state.mode + 1);
    },
    toggleNegative() {
        runInAction(() => this.state.showNegative = !this.state.showNegative);
    }
};


const ConnectedEntities = observer(() => {
    const { data, currentCoo, showNegative } = Store.state;
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
                        color={currentCoo === coo ? 'yellow' : getColor(color, showNegative)}
                    />
                );
            })}
        </group>
    );
});

function getColor(color: number, showNegative: boolean): string {
    const c = Math.round(color * 255 / INITIAL_VALUE);
    return c >= 0 ? `rgb(${c}, ${c}, ${c})` : `rgb(${showNegative ? -c : 0}, ${0}, ${0})`;
}


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
