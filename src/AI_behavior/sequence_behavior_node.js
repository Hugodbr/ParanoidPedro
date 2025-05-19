import { NODE_STATUS } from "./behavior_node.js";
import { ControlBehaviorNode } from "./control_behavior_node.js";

export class SequenceBehaviorNode extends ControlBehaviorNode {
    
    constructor() {
        super();
    }
    
	exec() {

        let i = 0;

        while(i < this.son_nodes.length &&  this.son_nodes[i].exec() !== NODE_STATUS.FAILURE) ++i;
        
        if(i < this.son_nodes.length) {
            return NODE_STATUS.FAILURE;
        }

        return NODE_STATUS.SUCCESS;
    }
}