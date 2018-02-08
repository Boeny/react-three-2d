import { action } from 'mobx';
import { Store } from '../store';
import { convertToColor } from '../utils';
import { IStore, Color } from '../types';


const getSetColorAction = (store: IStore) => (color: string) => {
    if (store.state.mesh.background !== color) {
        store.state.mesh.background = color;
    }
};
export const setColor = action(getSetColorAction(Store));


const getColorAction = (store: IStore) => (): Color => {
    return convertToColor(store.state.mesh.background);
};
export const getColor = getColorAction(Store);


export function getRotateRightAction = (store: IStore) => () => {
    store.angle += store.speed;
};


export function getRotateLeftAction = (store: IStore) => () => {
    store.angle += store.speed;
};
