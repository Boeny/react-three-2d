import * as React from 'react';
import { Store } from './store';
import { Store as movable } from '../movable/store';
import { Store as events } from '../events/store';
import { Store as audio, getFreqFunction } from '../audio';
import { MountAndInit } from '../mount-and-init';
import { Map } from '../map';
import { INITIAL_VALUE } from './constants';


const getFreq = getFreqFunction(-INITIAL_VALUE, INITIAL_VALUE);

export function Entities() {
    return (
        <MountAndInit
            component={<Map />}
            onMount={() => {
                movable.add({ onEveryTick });
                Store.init();
            }}
        />
    );
}

function onEveryTick() {
    if (events.state.stepMode === false) {
        Store.nextStep();
        if (audio.source) {
            const value = 0;
            audio.source.frequency.value = value === 0 ? 0 : getFreq(value);
        }
    }
}
