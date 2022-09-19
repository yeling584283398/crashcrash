import { _decorator, Component, Node, resources, Prefab, tween, Tween, dragonBones, instantiate } from 'cc';
import EventManager, { EventType } from './EventManager';
import { Card } from './Card';
import { UIManager } from './UIManager';
import { Result } from './Result';
import { dataManager } from './Datamanager';
const { ccclass, property } = _decorator;

@ccclass('Container')
export class Container extends Component {
    @property({
        type: Node
    })
    box: Node;
    @property({
        type: Node
    })
    bgBox: Node;
    @property({
        type: Prefab
    })
    crashEffect: Prefab;

    onLoad() {
        EventManager.on(EventType.SELECT_CARD, this.addCard, this);
        EventManager.on(EventType.RESTART, this.restart, this);
    }

    restart() {
        this.box.removeAllChildren();
    }
    
    addCard(card: Card) {
        const children = this.box.children;
        const len = children.length;
        let index = len, count = 1;
        for (let i = len - 1; i >= 0; i--) {
            const sourceCard = children[i].getComponent(Card);
            if (sourceCard.type === card.type) {
                if (count === 1) index = i + 1;
                count++;
            };
        }
        const worldPos = card.node.getWorldPosition();
        this.box.insertChild(card.node, index);
        card.node.setWorldPosition(worldPos);
        if (index !== len) {
            this.resort();
        }
        const targetPosition = this.bgBox.children[index].position;
        tween(card.node)
            .to(0.3, { position: targetPosition })
            .call(() => {
                if (count >= 3) {
                    this.crash(index);
                    this.scheduleOnce(() => {
                        this.resort();
                    }, 0.2)
                }
                if (this.box.children.length >= 7) {
                    const resultPage = UIManager.open('result');
                    const result = resultPage.getComponent(Result);
                    result.init('lose');
                }
            })
            .start();
        
        if (dataManager.cardCount === 0) {
            const resultPage = UIManager.open('result');
            const result = resultPage.getComponent(Result);
            result.init('win');
        }
    }

    crash(index: number) {
        let count = 3;
        for (let i = index; count > 0; i--, count--) {
            const position = this.box.children[i].position;
            const effect = instantiate(this.crashEffect);
            effect.setPosition(position);
            this.node.addChild(effect);
            this.box.children[i].destroy();
            this.box.children[i].removeFromParent();
        }
    }

    resort() {
        this.box.children.forEach((child, i) => {
            const targetPosition = this.bgBox.children[i].position;
            if (child.position.x !== targetPosition.x) {
                Tween.stopAllByTarget(child);
                tween(child)
                    .to(0.15, { position: targetPosition })
                    .start();
            }
        })
    }
}

