import * as React from 'react';
import { Store } from './store';
import { Store as movable } from '../movable/store';
import { Store as events } from '../events/store';
import { Store as audio, getFreqFunction } from '../audio';
import { MountAndInit } from '../mount-and-init';
import { GlobalMap } from './global-map';
import { LocalMap } from './local-map';
import { INITIAL_VALUE } from './constants';


const getFreq = getFreqFunction(-INITIAL_VALUE, INITIAL_VALUE);

export function Entities() {
    return (
        <MountAndInit
            component={(
                <group>
                    <GlobalMap />
                    <LocalMap />
                </group>
            )}
            onMount={() => {
                movable.add({ onEveryTick });
                Store.init();
                if (audio.source) {
                    audio.source.frequency.value = 0;
                    audio.source.start(0);
                }
            }}
        />
    );
}

function onEveryTick() {
    if (events.state.stepMode === false) {
        Store.nextStep();
        if (audio.source) {
            const value = Store.state.data[Store.state.currentCoo] || 0;
            audio.source.frequency.value = value === 0 ? 0 : getFreq(value);
        }
    }
}
