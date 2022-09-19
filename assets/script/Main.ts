import { _decorator, Component, resources, Prefab, instantiate, Node, AudioClip } from 'cc';
import EventManager from './EventManager';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {

    start() {
        EventManager.init(this.node);
        UIManager.init(this.node);
        resources.loadDir('prefab', () => {
            UIManager.open('game');
        })
    }
}

