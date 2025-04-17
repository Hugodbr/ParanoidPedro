import { BehaviorNode } from "behavior_node.js";

export default class ExecutionBehaviorNode extends BehaviorNode {

    /**
     * @type {function}
     */
    execution_func;

    /**
     * @param {function} execution_func
     * The function must return a NODE_STATUS value
     */
    constructor(execution_func) {

        this.execution_func = execution_func;
    }

    exec() {

        let return_val = execution_func();

        console.assert(
            return_val !== NODE_STATUS.SUCCESS &&
            return_val !== NODE_STATUS.FAILURE &&
            return_val !== NODE_STATUS.RUNNING,
            "ExecutionBehaviorNode exec must return a valid NODE_STATUS");

        return return_val;
    }
}