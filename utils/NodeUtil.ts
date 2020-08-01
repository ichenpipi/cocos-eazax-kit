/**
 * 节点工具
 */
export default class NodeUtil {

    /**
     * 获取节点在目标节点（容器）下的相对位置
     * @param node 节点
     * @param target 目标节点（容器）
     */
    public static getRelativePosition(node: cc.Node, target: cc.Node): cc.Vec2 {
        let worldPos = node.getParent().convertToWorldSpaceAR(node.getPosition());
        let targetPos = target.convertToNodeSpaceAR(worldPos);
        return targetPos;
    }

}
