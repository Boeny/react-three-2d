import { action } from 'mobx';
import { IStore, ConnectedStore } from './types';


export const setCanvas = (store: IStore) => action((el: HTMLCanvasElement | null) => {
    store.canvas = el;
});


export const setCursor = (store: IStore) => action((cursor: string) => {
    if (store.canvas) {
        store.canvas.style.cursor = cursor;
    }
});


export const setContent = (store: IStore) => action((c: ConnectedStore | null) => {
    store.content = c && c.name || null;
});
