// import { observable } from 'mobx';
import { push } from './actions';
import { IStore } from './types';


const Store: IStore = {
    bodies: [],// observable([]),
    push() {}
};

Store.push = push(Store);

export { Store };
