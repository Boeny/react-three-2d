import { IStore, MovableStore, IBodyStore } from './types';


export const Store: IStore = {
    bodies: [],
    add(el: MovableStore) {
        this.bodies.push(el);
    },
    del(el: MovableStore) {
        const i = this.bodies.indexOf(el);
        this.bodies.splice(i, 1);
    },
    isBody(el: MovableStore): el is IBodyStore {
        return el.hasOwnProperty('velocity') && el.hasOwnProperty('position')
            && el.hasOwnProperty('setVelocity') && el.hasOwnProperty('updatePositionBy');
    }
};
