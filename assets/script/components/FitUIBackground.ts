import { _decorator, Component, view, Vec3, find, Node, Sprite, UITransform, Widget } from "cc";

const { ccclass, requireComponent, property } = _decorator;

@ccclass('FitUIBackground')
@requireComponent(Widget)
export default class FitUIBackground extends Component {

    @property({ tooltip: "当设备分辨率大于设计分辨率，是否需要等比例放大背景图尺寸" }) needEnlargeBgcSize = false;

    @property({ tooltip: "父节点是否包含mask" }) isUseMask = false;


    private bgWidth: number;
    private bgHeight: number;

    start() {
        let widget = this.node.getComponent(Widget);

        if (this.needEnlargeBgcSize) {
            this.resizeBg();
            return;
        }

        view.on('canvas-resize', () => {
            if (this.needEnlargeBgcSize && this.bgWidth > 0 && this.bgHeight > 0) {
                this.resizeBg();
            }
        });

        if (!widget) {
            widget = this.node.addComponent(Widget);
        }

        widget.alignFlags = 7;// 引擎没导出枚举 __private.cocos_ui_widget_AlignFlags.VERTICAL;

    }

    resizeBg() {
        // 首页多背景滑动，bg外父元素包含mask，需同步放大高度
        if (this.isUseMask) {
            const parentScale = this.getScaleByNodeSize(this.node.parent);
            this.resizeNodeByScale(this.node.parent, 1, parentScale);
        }
        const texture = this.node?.getComponent(Sprite)?.spriteFrame?.texture;
        if (texture) {
            const scale = this.getScaleBySpriteSize(texture);
            this.resizeNodeByScale(this.node, scale, scale);
        }
        // UIRoot为适配ios机型有偏移, 背景节点反方向偏移
        const diffY = find('Canvas/UIRoot').position.y;
        if (diffY !== 0) {
            this.isUseMask ? this.resetCoordinateY(this.node.parent, -diffY) : this.resetCoordinateY(this.node, -diffY);
        }
    }

    resizeNodeByScale(node: Node, scaleWidth: number, scaleHeight: number) {
        const { width, height } = node.getComponent(UITransform).contentSize;
        node.getComponent(UITransform).setContentSize(width * scaleWidth, height * scaleHeight);
    }

    getScaleBySpriteSize(texture) {
        let scale = 1;
        this.bgWidth = texture.width;
        this.bgHeight = texture.height;
        const visibleSize = find('Canvas').getComponent(UITransform).contentSize;
        if (visibleSize.height > this.bgHeight) {
            scale = visibleSize.height / this.bgHeight;
        }
        return scale;
    }

    getScaleByNodeSize(node: Node) {
        const nodeSize = node.getComponent(UITransform).contentSize;
        const visibleSize = find('Canvas').getComponent(UITransform).contentSize;
        let scale = 1;
        if (visibleSize.height > nodeSize.height) {
            scale = visibleSize.height / nodeSize.height;
        }
        return scale;
    }

    resetCoordinateY(node: Node, newY: number) {
        const widget = node.getComponent(Widget);
        if (widget) widget.enabled = false;
        const { x, z } = node.position;
        node.setPosition(new Vec3(x, newY, z));
    }

    // update (dt) {}
}
