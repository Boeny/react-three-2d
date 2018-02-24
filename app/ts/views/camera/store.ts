import { observable } from 'mobx';
import { Vector3 } from 'three';
import { IStore } from './types';


export const Store: IStore = {
    state: observable({
        zoom: 1,
        position: new Vector3(0, 0, 5)
    }),
    DOM: null,
    speed: null
};
