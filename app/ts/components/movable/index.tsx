import { Store } from './store';


export function Movable() {
    if (!Store.bodies.every(body => Store.isBody(body))) {
        return null;
    }
    return null;
}
