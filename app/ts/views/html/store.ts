import { observable } from 'mobx';
import { Vector2 } from 'three';
import { setCanvas, setCursor, setContent } from './actions';
import { IStore } from './types';


const Store: IStore = observable({
    DOM: null,
    canvas: null,
    content: null,
    position: new Vector2(),
    setCanvas() {},
    setCursor() {},
    setContent() {}
});

Store.setCanvas = setCanvas(Store);
Store.setCursor = setCursor(Store);
Store.setContent = setContent(Store);

export  { Store };
