import { BehaviorNode, NODE_STATUS } from "./behavior_node.js";

export class ExecutionBehaviorNode extends BehaviorNode {

    /**
     * @type {function}
     */
    execution_func;

    /**
     * The function must return a NODE_STATUS value
     * @param {function} execution_func
     */
    constructor(execution_func) {
        super();
        this.execution_func = execution_func;
    }

    exec() {

        let return_val = this.execution_func();

        console.assert(
            return_val === NODE_STATUS.SUCCESS ||
            return_val === NODE_STATUS.FAILURE ||
            return_val === NODE_STATUS.RUNNING,
            "ExecutionBehaviorNode exec must return a valid NODE_STATUS");

        return return_val;
    }
}