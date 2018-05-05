import { observable } from 'mobx';
import { IStore } from './types';


export const Store: IStore = observable({
    colliders: []
});
