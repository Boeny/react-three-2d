import { observable } from 'mobx';
import { getDefaultState } from './utils';


export const Store = observable({
    state: getDefaultState()
});
