import { SavedData } from '~/components/entities/types';
import { data, stack } from './data.json';
import { state, camera } from './state.json';

export const savedData = {
    stack,
    ...camera,
    state: {
        data,
        ...state
    }
} as SavedData;
