import { BehaviorNode } from "./behavior_node.js";

export class ControlBehaviorNode extends BehaviorNode {

	son_nodes = new Array();

	constructor() {
        super();
    }

	/**
	 * Adds a new `BehaviorNode` and returns this actual object
	 * @param {BehaviorNode} bh_node New son behavior node
	 * @returns {ControlBehaviorNode} `this`
	*/
	addNode(bh_node) {
		console.assert(bh_node instanceof BehaviorNode, "son node bh_node must be a BehaviorNode");
		
		this.son_nodes.push(bh_node);

		return this;
	}
}