import { observable } from 'mobx';
import { Vector3 } from 'three';
import { IStore } from './types';


export const Store: IStore = observable({
    zoom: 0.5,
    DOM: null,
    position: new Vector3(0, 0, 5)
});
