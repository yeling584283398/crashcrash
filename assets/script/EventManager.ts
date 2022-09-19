import { Node } from "cc";

export const enum EventType{
    SELECT_CARD = 'SELECT_CARD',
    RESTART = 'restart'
}

export default class EventManager {
    private static node: Node;

    static init(node: Node) {
        this.node = node;
    }

    static on(type: EventType, callback: Function, target?: any) {
        this.node.on(type, callback, target);
    }

    static off(type: EventType, callback?: Function, target?: any) {
        this.node.off(type, callback, target);
    }

    static emit(type: EventType, ...arg: any[]) {
        this.node.emit(type, ...arg);
    }
}
window['EE'] = EventManager;