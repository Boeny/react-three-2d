import { observable } from 'mobx';
import { Vector3, Vector2 } from 'three';
import { IStore } from './types';


export const Store: IStore = observable({
    zoom: 1,
    DOM: null,
    position: new Vector3(0, 0, 5),
    speed: new Vector2()
});
