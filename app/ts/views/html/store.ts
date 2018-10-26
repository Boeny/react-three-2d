import { observable, runInAction } from 'mobx';
import { IStore } from './types';


export const Store: IStore = {
    canvas: null,
    state: observable({
        content: null,
        position: { x: 0, y: 0 },
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
    }),
    setCanvas(el: HTMLCanvasElement | null) {
        this.canvas = el;
    },
    setCursor(cursor: string) {
        if (this.canvas) {
            this.canvas.style.cursor = cursor;
        }
    },
    setContent(text: string | JSX.Element | null) {
        runInAction(() => {
            this.state.content = text;
        });
    },
    setSize() {
        runInAction(() => {
            this.state.windowWidth = window.innerWidth;
            this.state.windowHeight = window.innerHeight;
        });
    }
};
