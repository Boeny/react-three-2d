import { action } from 'mobx';
import { Store } from './store';
import { IStore } from './types';


const getZoomSetterAction = (store: IStore) => (zoom: number) => {
    if (zoom > 0) {// farther
        store.zoom /= 1.5;
    } else {// nearer
        store.zoom += Math.sqrt(store.zoom) / 100;
    }
};
export const setZoom = action(getZoomSetterAction(Store));


const getElementSetterAction = (store: IStore) => (element: any) => {
    store.DOM = element;
};
export const setCamera = action(getElementSetterAction(Store));
