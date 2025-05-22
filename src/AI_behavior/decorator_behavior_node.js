import { BehaviorNode } from "./behavior_node.js";

export class DecoratorBehaviorNode extends BehaviorNode {

	son_node = null;

	constructor() {
        super();
    }

	/**
	 * Adds a new `BehaviorNode` and returns this actual object
	 * @param {BehaviorNode} bh_node New son behavior node
	 * @returns {ControlBehaviorNode} `this`
	*/
	setNode(bh_node) {
		console.assert(bh_node instanceof BehaviorNode, "son node bh_node must be a BehaviorNode");
		
		this.son_node = bh_node;
	}
}