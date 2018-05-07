import { observable } from 'mobx';
import { IStore } from './types';


export const Store: IStore = observable({
    DOM: null,
    canvas: null,
    content: null
});
