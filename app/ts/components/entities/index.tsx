import * as React from 'react';
import { Store } from './store';
import { Store as movable } from '../movable/store';
import { Store as events } from '../events/store';
import { Store as audio } from '../audio';
import { MountAndInit } from '../mount-and-init';
import { GlobalMap } from './global-map';
import { LocalMap } from './local-map';
import { INITIAL_VALUE } from './constants';


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
                    audio.source.frequency.value = getFreq(INITIAL_VALUE);
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
            audio.source.frequency.value = getFreq(Store.state.data[Store.state.currentCoo] || 0);
        }
    }
}

function getFreq(v: number) {
    return (v > 0 ? 10000 * v + 5000 : -v * 5000 + 20) / INITIAL_VALUE;
}
