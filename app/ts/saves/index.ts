import { SavedData } from '~/components/entities/types';
import { data, stack, local, nextState } from './data.json';
import { state, camera } from './state.json';

export const savedData = {
    stack,
    camera,
    nextState,
    state: {
        data,
        local,
        ...state
    }
} as SavedData;
