import { _decorator, Component, Node, instantiate, Prefab, Input, EventTouch, Button } from 'cc';
import { dataManager } from './Datamanager';
import { Card, EnumDir } from './Card';
import EventManager, { EventType } from './EventManager';
import { UIManager } from './UIManager';
import { Result } from './Result';
import { Container } from './Container';
import { BottomBtn } from './components/BottomBtn';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property({
        type: Prefab
    })
    cardPrefab: Prefab;
    @property({
        type: Node
    })
    cardMapBox: Node;
    @property({
        type: Container
    })
    bottomContainer: Container;
    @property({
        type: Node
    })
    leftCardList: Node;
    @property({
        type: Node
    })
    rightCardList: Node;
    @property({
        type: [Node]
    })
    bottomCardList: Node[] = [];

    private lastSelectCard: Card;

    onLoad() {
        this.init();
        EventManager.on(EventType.RESTART, this.restart, this);
        EventManager.on(EventType.SELECT_CARD, this.selectCard, this);
    }

    init() {
        dataManager.initCardTypes();
        this.createLeftCardList();
        this.createRightCardList();
        this.createCardMap();
    }

    selectCard(card: Card) {
        this.lastSelectCard = card;
    }

    createCardMap() {
        for (let i = 0; i < dataManager.mapCount; i++) {
            const layer = this.createCardLayer();
            const map = dataManager.increaseCardMap();
            map.forEach((id) => {
                this.createCard(id, i, layer);
            })
            
        }
    }

    createLeftCardList() {
        for (let i = 0; i < dataManager.LIST_COUNT; i++) {
            this.createCard(0, i, this.leftCardList, EnumDir.LEFT);
        }
    }

    createRightCardList() {
        for (let i = 0; i < dataManager.LIST_COUNT; i++) {
            this.createCard(2, i, this.rightCardList, EnumDir.RIGHT);
        }
    }

    createCardLayer() {
        const layer = new Node();
        this.cardMapBox.addChild(layer);
        return layer;
    }

    createCard(startId: number, mapIndex: number, parent: Node, listDir?: EnumDir) {
        const cardNode = instantiate(this.cardPrefab);
        const card = cardNode.getComponent(Card);
        const type = dataManager.getNextCardType();
        card.init({ type, active: true, startId, mapIndex, listDir, parent });
        dataManager.addCard(card);
        parent.addChild(cardNode);
    }

    restart() {
        this.cardMapBox.removeAllChildren();
        this.leftCardList.removeAllChildren();
        this.rightCardList.removeAllChildren();
        this.bottomCardList.forEach((list) => {
            list.removeAllChildren();
        })
        this.init();
    }

    refresh(e: EventTouch) {
        const types = []
        this.cardMapBox.children.forEach((layer) => {
            layer.children.forEach((child) => {
                const card = child.getComponent(Card);
                types.push(card.type);
            })
        });
        this.leftCardList.children.forEach((child) => {
            const card = child.getComponent(Card);
            types.push(card.type);
        })
        this.rightCardList.children.forEach((child) => {
            const card = child.getComponent(Card);
            types.push(card.type);
        })
        types.sort(() => 0.5 - Math.random());
        this.cardMapBox.children.forEach((layer) => {
            layer.children.forEach((child) => {
                const card = child.getComponent(Card);
                const type = types.pop();
                card.updateType(type);
            })
        })
        this.leftCardList.children.forEach((child) => {
            const card = child.getComponent(Card);
            const type = types.pop();
            card.updateType(type);
        })
        this.rightCardList.children.forEach((child) => {
            const card = child.getComponent(Card);
            const type = types.pop();
            card.updateType(type);
        })
        if (e) e.currentTarget.getComponent(BottomBtn).toggleActive(false);
    }

    put(e?: EventTouch) {
        const cardNodes = this.bottomContainer.box.children.slice(0, 3);
        cardNodes.forEach((node: Node, i) => {
            const card = node.getComponent(Card);
            const parent = this.bottomCardList[i];
            const mapIndex = parent.children.length;
            card.init({ type: card.type, active: true, startId: 4 + i * 2, mapIndex, parent, listDir: EnumDir.BOTTOM });
            parent.addChild(node);
            dataManager.addCard(card);
        })
        this.bottomContainer.resort();
        if (e) e.currentTarget.getComponent(BottomBtn).toggleActive(false);
    }

    retry(e: EventTouch) {
        const card = this.lastSelectCard;
        if (!card) return;
        if (!card.node?.isValid || card.parent === card.node.parent) return;
        card.parent.addChild(card.node);
        card.initPosition();
        card.touchable = true;
        dataManager.addCard(card);
        if (e) e.currentTarget.getComponent(BottomBtn).toggleActive(false);
    }
}

