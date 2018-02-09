import { action } from 'mobx';
import { Store } from './store';
import { getSetColorAction, getRotateLeftAction, getRotateRightAction } from '~/actions';


export const setColor = action(getSetColorAction(Store));

export const rotateLeft = action(getRotateLeftAction(Store));

export const rotateRight = action(getRotateRightAction(Store));
