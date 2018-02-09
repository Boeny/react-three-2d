import * as React from 'react';
import { MountAndInit } from '~/components/mount-and-init';
import { Loading } from './loading';
import { Scene } from './scene';
import { Test } from './test';


let checkBkColor = function () {};

export function App() {
    return (
        <MountAndInit
            defaultComponent={<Loading />}
            component={(
                <div>
                    <Test onMount={check => {
                        checkBkColor = check;
                    }} />
                    <Scene onUpdate={() => {
                        checkBkColor();
                    }}/>
                </div>
            )}
        />
    );
}
