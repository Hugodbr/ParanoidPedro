import { BehaviorNode, NODE_STATUS } from "./behavior_node.js";
import { DecoratorBehaviorNode } from "./decorator_behavior_node.js";

/**
 * Inverts the statut result of its son node
 */
export class InversionBehaviorNode extends DecoratorBehaviorNode {

    constructor() {
        super();
    }
    
    exec() {
        let status = this.son_node.exec();

        if(status === NODE_STATUS.SUCCESS || status === NODE_STATUS.RUNNING) {
            return NODE_STATUS.FAILURE;
        }

        return NODE_STATUS.SUCCESS;
    }
}