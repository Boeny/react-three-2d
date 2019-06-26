import { Object3D } from 'three';
import { observable, action } from 'mobx';
import { IStore, Sphere } from './types';


export const Store: IStore = observable({
    data: [],
    selected: null
});

export const setMapData = action((data: Sphere[]) => {
    Store.data = data;
});

export const selectObject = action((obj: Object3D | null) => {
    Store.selected = obj;
});
