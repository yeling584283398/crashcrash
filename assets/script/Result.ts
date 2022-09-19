import { _decorator, Component, Input, EventTouch } from 'cc';
import { dataManager } from './Datamanager';
import EventManager, { EventType } from './EventManager';
const { ccclass } = _decorator;

@ccclass('Result')
export class Result extends Component {
    onLoad() {
        this.node.on(Input.EventType.TOUCH_END, (e: EventTouch) => {
            e.propagationStopped = true;
        })
    }

    init(type: string) {
        this.node.getChildByName(type).active = true;
    }

    playAgain() {
        this.node.destroy();
        dataManager.reset();
        EventManager.emit(EventType.RESTART);
    }
}

