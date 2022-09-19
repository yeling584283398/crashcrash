import { _decorator, Component, Node, Sprite, SpriteFrame, Input, instantiate, UIOpacity } from 'cc';
import EventManager, { EventType } from './EventManager';
import { dataManager } from './Datamanager';
const { ccclass, property } = _decorator;

export const enum EnumDir{
    LEFT = 'left',
    RIGHT = 'right',
    TOP = 'top',
    BOTTOM = 'bottom'
}

export type TypeCardInitOptions = {
    type: number,
    active: boolean,
    startId: number,
    mapIndex: number,
    parent: Node,
    listDir?: EnumDir
}

@ccclass('Card')
export class Card extends Component {
    @property({
        type: Sprite
    })
    element: Sprite;
    @property({
        type: Node
    })
    shadow: Node;
    @property({
        type: [SpriteFrame]
    })
    spriteFrames: SpriteFrame[] = [];
    @property
    type = 0;

    active = true;
    touchable = true;

    posMap = {};
    startId = 0;
    mapIndex = 0;
    listDir: EnumDir;
    parent: Node;

    onLoad() {
        this.node.on(Input.EventType.TOUCH_END, this.onTouch, this);
    }

    init(options: TypeCardInitOptions) {
        this.startId = options.startId;
        this.mapIndex = options.mapIndex;
        this.listDir = options.listDir;
        this.parent = options.parent;
        this.updateType(options.type);
        this.updateStatus(options.active);
        this.initPosMap();
        this.initPosition();
    }

    onTouch() {
        if (!this.touchable) return;
        this.touchable = false;
        dataManager.removeCard(this);
        EventManager.emit(EventType.SELECT_CARD, this);
    }

    initPosition(startId = this.startId) {
        let x = 0, y = 0;
        if (this.listDir) {
            switch (this.listDir) {
                case EnumDir.LEFT:
                    x = this.mapIndex * 10;
                    break;
                case EnumDir.RIGHT:
                    x = -this.mapIndex * 10;
                    break;
                case EnumDir.TOP:
                    y = -this.mapIndex * 10;
                    break;
                case EnumDir.BOTTOM:
                    y = this.mapIndex * 10;
                    break;
            }
        } else {
            x = (startId % 14 + 1) * 44;
            y = -(Math.floor(startId / 14) + 1) * 55;
        }
        this.node.setPosition(x, y);
    }

    initPosMap(startId = this.startId) {
        this.posMap = {};
        this.posMap[startId] = true;
        this.posMap[startId + 1] = true;
        this.posMap[startId + 14] = true;
        this.posMap[startId + 15] = true;
    }

    updatePosMap(id: number, active: boolean) {
        this.posMap[id] = active;
        const hasCover = Object.keys(this.posMap).find((id) => {
            return !this.posMap[id]
        })
        this.updateStatus(!hasCover);
    }

    updateType(type: number) {
        this.type = type;
        this.element.spriteFrame = this.spriteFrames[type];
    }

    updateStatus(active: boolean) {
        this.active = active;
        this.shadow.active = !active;
        this.touchable = active;
        if (!active) {
            const opacity = this.shadow.getComponent(UIOpacity);
            opacity.opacity = this.listDir ? 220 : 125;
        }
    }

}

