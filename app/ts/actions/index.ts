

export const getSetColorAction = (store: MeshStore) => (color: string) => {
    if (store.style.background !== color) {
        store.style.background = color;
    }
};


export const getRotateRightAction = (store: MeshStore) => () => {
    store.angle += store.rotationSpeed;
};


export const getRotateLeftAction = (store: MeshStore) => () => {
    store.angle += store.rotationSpeed;
};


export const getElementSetterAction = (store: ElementStore) => (element: HTMLElement | null) => {
    store.DOM = element;
};
