import { observable } from 'mobx';
import { IStore } from './types';


export const Store: IStore = observable({
    style: { background: 'rgb(0, 232, 255)' },
    rotationSpeed: 0.1,
    angle: 0
});
