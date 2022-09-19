import { Card } from "./Card";

const mapList = [
    [14, 16, 18, 22, 24, 26, 42, 50, 70, 72, 74, 78, 80, 82, 98, 106, 126, 128, 130, 134, 136, 138],
    [16, 28, 32, 44, 56, 60, 72, 84, 88, 100, 112, 116, 35, 63, 91, 119, 23, 79, 25, 81, 54],
    [14, 16, 18, 42, 58, 70, 74, 86, 102, 126, 128, 130, 22, 26, 50, 54, 78, 80, 82, 106, 110, 134, 137]
]
// const mapList = [[]];
// const start = 14;
// let index = start;
// while (index < 168) {
//     mapList[0].push(index);
//     index += 2;
//     if (index > 0 && (index - start) % 14 === 0) {
//         index += 14
//     }
// }
// console.log(mapList);

class DataManager {
    private readonly TYPE_COUNT = 13;
    private cardMap: Record<string, Card>[] = [];
    private cardListMap: Record<string, Card>[] = [];
    private mapIndex = 0;
    private cardTypeMap = {};
    private cardTypes = [];
    private curMapIndex = -1;
    private singleCardTypes = [];
    readonly LIST_COUNT = 12;
    cardCount = 0;
    mapCount = mapList.length;

    private getCardTotalCount() {
        let count = 0;
        mapList.forEach((map) => {
            count += map.length;
        })
        count += this.LIST_COUNT * 2;
        return count;
    }

    initCardTypes() {
        const totalCount = this.getCardTotalCount();
        const groundTypeCount = this.TYPE_COUNT * 3
        const avg = Math.floor(totalCount / groundTypeCount);
        for(let i = 0; i < this.TYPE_COUNT; i++) {
            this.cardTypeMap[i] = avg * 3;
            this.cardTypes.push(i);
        }
        let remain = totalCount % groundTypeCount;
        const types = new Array(this.TYPE_COUNT).fill(0).map((v, i) => i);
        while (remain > 0) {
            const type = types.splice(Math.floor(Math.random() * types.length), 1)[0];
            this.cardTypeMap[type] += 3;
            remain -= 3;
        }
    }

    getNextCardType() {
        if (this.curMapIndex !== this.mapIndex) {
            this.curMapIndex = this.mapIndex;
            this.singleCardTypes = this.cardTypes.slice();
        }
        if (this.singleCardTypes.length === 0) {
            this.singleCardTypes = this.cardTypes.slice();
        }
        const type = this.singleCardTypes.splice(Math.floor(Math.random() * this.singleCardTypes.length), 1)[0];
        this.cardTypeMap[type]--;
        if (this.cardTypeMap[type] <= 0) {
            this.cardTypes.splice(this.cardTypes.indexOf(type), 1);
        }
        return type;
    }

    increaseCardMap() {
        const map = mapList[this.mapIndex];
        this.mapIndex++;
        return map;
    }

    addCard(card: Card) {
        this.cardCount++;
        const index = card.mapIndex;
        const cardMap = card.listDir ? this.cardListMap : this.cardMap;
        let map = cardMap[index];
        if (!map)map = cardMap[index] = {};
        Object.keys(card.posMap).forEach((id) => {
            map[id] = card;
            this.updateLastMap(card, id, false);
        })
    }

    removeCard(card: Card) {
        this.cardCount--;
        const index = card.mapIndex;
        if (index <= 0) return;
        Object.keys(card.posMap).forEach((id) => {
            this.updateLastMap(card, id, true);
        })
    }

    updateLastMap(card: Card, id: string, active: boolean) {
        let index = card.mapIndex;
        const cardMap = card.listDir ? this.cardListMap : this.cardMap;
        let lastMap = {};
        while (!lastMap[id] && index > 0) {
            lastMap = cardMap[--index];
        }
        lastMap[id] && lastMap[id].updatePosMap(+id, active);
    }

    reset() {
        this.cardMap = [];
        this.mapIndex = 0;
        this.cardTypeMap = {};
        this.cardTypes = [];
        this.curMapIndex = -1;
        this.singleCardTypes = [];
        this.cardCount = 0;
    }

}

export const dataManager = new DataManager();
window['data'] = dataManager;