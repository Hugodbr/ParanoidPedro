export const NODE_STATUS = {
	SUCCESS: "SUCCESS",
	FAILURE: "FAILURE",
	RUNNING: "RUNNING"
};

export default class BehaviorNode {

	// Virtual method that executes de corresponding behavior returning a NODE_STATUS
	exec() {
		console.assert(false, "BehaviorNode.exec() pure virtual method not overriden");
	}
}