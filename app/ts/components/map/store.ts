import { observable, action } from 'mobx';
import { IStore, Sphere } from './types';


export const Store: IStore = observable({
    data: []
});

export const setMapData = action((data: Sphere[]) => {
    Store.data = data;
});
