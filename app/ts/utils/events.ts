import { observable, action } from 'mobx';
import { Vector2 } from 'three';
import { cameraStore } from '~/components/camera/store';
import { playerStore } from '~/components/player/store';
import { IStore as IEventsStore } from '~/components/events/types';
import { Store as movable } from '~/components/movable/store';
import { Store as html } from '~/views/html/store';
import { getMouseVector } from '~/utils';
import { getCollider } from '~/components/colliders/utils';
import { IStore as IBodyStore } from '~/components/body/types';
import { MOUSE, KEY } from '~/constants';


class EventsStore implements IThreeEvents, IEventsStore {

    private dragStartPoint: Vector2 | null = null;

    @observable
    mouseDragMode: boolean = false;

    @observable
    stepMode: boolean = false;

    @observable
    switchMode: boolean = false;

    @action
    setMouseDragMode(mode: boolean): void {
        this.mouseDragMode = mode;
    }

    @action
    setStepMode(mode: boolean): void {
        this.stepMode = mode;
    }

    @action
    setSwitchMode(mode: boolean): void {
        this.switchMode = mode;
    }

    onWheel = (e: MouseWheelEvent): void => {
        cameraStore.setZoom(e.deltaY);
    }

    onMouseDown = (e: MouseEvent): void => {
        switch (e.button) {
            case MOUSE.left:
                this.setMouseDragMode(true);
                html.setCursor('pointer');
                this.dragStartPoint = getMouseVector(e);
                break;
            case MOUSE.right:
                break;
            case MOUSE.wheel:
                break;
        }
    }

    onMouseUp = (e: MouseEvent): void => {
        switch (e.button) {
            case MOUSE.left:
                if (this.dragStartPoint === null || this.mouseDragMode === false) {
                    return;
                }
                this.setMouseDragMode(false);
                html.setCursor('default');
                // camera.setSpeed(new Vector2());
                this.dragStartPoint = null;
                break;
            case MOUSE.right:
                break;
            case MOUSE.wheel:
                break;
        }
    }

    onMouseMove = (e: MouseEvent): void => {
        if (this.dragStartPoint === null || this.mouseDragMode === false) {
            return;
        }
        const v = getMouseVector(e);
        // camera.setSpeed(dragStartPoint.sub(v));
        this.dragStartPoint = v;
    }

    onKeyDown = (e: KeyboardEvent): void => {
        if (e.shiftKey) {
            this.setStepMode(true);
        }
        switch (e.key) {
            case KEY.LEFT:
                playerStore.moveLeft(true);
                break;
            case KEY.RIGHT:
                playerStore.moveRight(true);
                break;
            case KEY.UP:
                playerStore.moveUp(true);
                break;
            case KEY.DOWN:
                playerStore.moveDown(true);
                break;
            case KEY.SPACE:
                this.setSwitchMode(true);
                break;
        }
    }

    onKeyUp = (e: KeyboardEvent): void => {
        switch (e.key) {
            case KEY.LEFT:
                playerStore.moveLeft(false);
                break;
            case KEY.RIGHT:
                playerStore.moveRight(false);
                break;
            case KEY.UP:
                playerStore.moveUp(false);
                break;
            case KEY.DOWN:
                playerStore.moveDown(false);
                break;
        }
        if (!playerStore.isMoving) {
            this.setStepMode(false);
        }
    }

    onAnimate = (): void => {
        for (let i = 0; i < movable.bodies.length; i += 1) {
            const body = movable.bodies[i];
            this.checkCollision(body, 'x');
            this.checkCollision(body, 'y');
            body.onEveryTick && body.onEveryTick(body);
        }
    }

    private checkCollision(body: IBodyStore, coo: 'x' | 'y'): void {
        const velocity = body.velocity[coo];
        if (velocity === 0) {
            return;
        }
        const collider = coo === 'x' ?
            getCollider(body.position.x + velocity, body.position.y) :
            getCollider(body.position.x, body.position.y + velocity);
        const velocityVector = coo === 'x' ? new Vector2(velocity, 0) : new Vector2(0, velocity);
        if (collider) {
            body.onCollide && body.onCollide(collider);
            if (collider.isMovable) {
                collider.setVelocity(velocity, coo);
                // body.changePosition(velocityVector);
                // body.setVelocity(0, coo);
            } else {
                body.setVelocity(0, coo);
            }
        } else {// free way
            body.onUnCollide && body.onUnCollide();
            body.changePosition(velocityVector);
            body.setVelocity(0, coo);
        }
    }
}

export const eventsStore = new EventsStore();
