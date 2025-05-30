
/**
 * Singleton to centralize input logic.
 */
export default class InputManager
{
    /**
     * Get the instance of the InputManager singleton.
     * @remarks - InputManager must first be created before calling this method. Otherwise, the scene would be required as a parameter, which is not desired.
     * @returns {InputManager} InputManager instance.
     */
    static getInstance() 
    {
        if (!InputManager._instance) {
            console.log("No input manager was created!");
        }
        return InputManager._instance;
    }

    /**
     * @param {Scene} scene - where it's created.
     * @returns {InputManager} InputManager._instance if an instance already exists.
     */
    constructor(scene) 
    {
        /**
         * Enforces singleton pattern
         */
        if (InputManager._instance) {
            return InputManager._instance;
        }
        // If is the first instance
        InputManager._instance = this;

        this.scene = scene;

        // Connect to gamepad
        this.scene.input.gamepad.once("connected", pad => { this.gamepad = pad; });

        /**
         * References to keyboard bindings
         */
		this.jumpKey = this.scene.input.keyboard.addKey('W');
		this.leftMoveKey = this.scene.input.keyboard.addKey('A');
		this.rightMoveKey = this.scene.input.keyboard.addKey('D');
		this.rollKey = this.scene.input.keyboard.addKey('S');
		this.attackKey = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        /**
         * Reference to the gamepad controller
         * @type {Phaser.Input.Gamepad}
         */
        this.gamepad = null;
    }

    /**
     * Whether a left movement input is being pressed or not
     * @type {bool}
     */
    leftMoveInput()
    {
        return this.leftMoveKey.isDown 
            || this.gamepad !== null && this.gamepad.left
            || this.gamepad !== null && this.gamepad.leftStick.x < -0.5;
    }

    /**
     * Whether a right movement input is being pressed or not
     * @type {bool}
     */
    rightMoveInput()
    {
        return this.rightMoveKey.isDown 
            || this.gamepad !== null && this.gamepad.right
            || this.gamepad !== null && this.gamepad.leftStick.x > 0.5;
    }

    /**
     * Whether a jump movement input is being pressed or not
     * @type {bool}
     */
    jumpMoveInput()
    {
        return this.jumpKey.isDown 
            || this.gamepad !== null && this.gamepad.A;
    }

    /**
     * Whether a roll movement input is being pressed or not
     * @type {bool}
     */
    rollMoveInput()
    {
        return this.rollKey.isDown
            || this.gamepad !== null && this.gamepad.down; // TODO: ?
    }
    
    /**
     * Whether an attack action input is being pressed or not
     * @type {bool}
     */
    attackActionInput()
    {
        return this.attackKey.isDown
            || this.gamepad !== null && this.gamepad.down; // TODO: ?
    }
}