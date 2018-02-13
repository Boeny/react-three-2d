import { action } from 'mobx';
import { Store } from './store';
import { getElementSetterAction } from '~/actions';


export const setPlanet = action(getElementSetterAction(Store));

export const setCanvas = action((el: HTMLCanvasElement | null) => Store.canvas = el);

export const setCursor = action((cursor: string) => {
    if (Store.canvas) {
        Store.canvas.style.cursor = cursor;
    }
});
