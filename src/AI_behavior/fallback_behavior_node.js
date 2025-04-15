import { NODE_STATUS } from "behavior_node.j";
import { ControlBehaviorNode } from "control_behavior_node.js";

export default class FallbackBehaviorNode extends ControlBehaviorNode {

	exec() {

        let i = 0;

        while(i < this.son_nodes.length &&  this.son_nodes.array[i].exec() === NODE_STATUS.FAILURE) ++i;
        
        if(i < this.son_nodes.length) {
            return NODE_STATUS.SUCCESS;
        }

        return NODE_STATUS.FAILURE;
    }
}