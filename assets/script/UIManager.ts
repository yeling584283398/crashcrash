import { find, instantiate, Prefab, resources, Node } from "cc";

export class UIManager {
    private static UIRoot: Node
    static init(node: Node) {
        this.UIRoot = node;
    }
    static open(path: string) {
        const data = resources.get('prefab/' + path, Prefab);
        const node = instantiate(data)
        this.UIRoot.addChild(node);
        return node;
    }
}