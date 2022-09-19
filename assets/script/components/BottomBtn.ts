import { _decorator, Component, Node, Button } from 'cc';
import EventManager, { EventType } from '../EventManager';
const { ccclass, property } = _decorator;

@ccclass('BottomBtn')
export class BottomBtn extends Component {
    onEnable() {
        EventManager.on(EventType.RESTART, this.reset, this);
    }

    onDisable() {
        EventManager.off(EventType.RESTART);
    }

    toggleActive(active: boolean) {
        this.node.getChildByName('mask').active = !active;
        this.node.getComponent(Button).interactable = active;
    }

    reset() {
        this.toggleActive(true);
    }
}

