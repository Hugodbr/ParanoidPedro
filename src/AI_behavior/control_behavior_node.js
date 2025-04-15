import { BehaviorNode } from "behavior_node.js";

export default class ControlBehaviorNode extends BehaviorNode {

	son_nodes = new Array();

	/**
	 *  @param {BehaviorNode} bh_node New son behavior node
	*/
	addNode(bh_node) {
		console.assert(bh_node instanceof BehaviorNode, "son node bh_node must be a BehaviorNode");
		
		this.son_nodes.push(bh_node);
	}
}