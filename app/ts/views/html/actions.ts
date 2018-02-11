import { action } from 'mobx';
import { Store } from './store';
import { getElementSetterAction } from '~/actions';


export const setPlanet = action(getElementSetterAction(Store));
