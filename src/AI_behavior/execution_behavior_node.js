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

    /**
     * Returns a new `ExecutionBehaviorNode` that behaves as a Conditional Node that returns SUCCESS if the
     * expression passed is true and FAILURE if the expression passed is false when executing it
     * @param {function} condition_expression_func 
     * @returns {ExecutionBehaviorNode}
     */
    static buildConditionNode(condition_expression_func) {
        return new ExecutionBehaviorNode((() => 
        {
            if(condition_expression_func())
                return NODE_STATUS.SUCCESS;
            
            return NODE_STATUS.FAILURE;
        }));
    }
}