import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Store as movable } from '../movable/store';
import { Store as events } from '../events/store';
import { MountAndInit } from '../mount-and-init';
import { GlobalMap } from './global-map';
import { LocalMap } from './local-map';


export const Entities = observer((_: PositionProps) => {
    const { mode } = Store.state;
    return (
        <MountAndInit
            component={(
                <group>
                    <GlobalMap />
                    {mode > 0 ? <LocalMap /> : null}
                </group>
            )}
            onMount={() => {
                movable.add({ onEveryTick });
                Store.init();
            }}
        />
    );
});

function onEveryTick() {
    if (events.state.stepMode === false) {
        Store.nextStep();
    }
}
