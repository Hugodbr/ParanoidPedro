import { NODE_STATUS } from "./behavior_node.js";
import { DecoratorBehaviorNode } from "./decorator_behavior_node.js";

/**
 * Always returns FAILURE
 */
export class ForceFailureBehaviorNode extends DecoratorBehaviorNode {

    constructor() {
        super();
    }
    
    exec() {
        this.son_node.exec();
        return NODE_STATUS.FAILURE;
    }
}