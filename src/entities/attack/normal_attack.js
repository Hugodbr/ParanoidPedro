import Attack from "./attack.js";

import { TextureKeys, AnimationKeys, SoundKeys } from "../../../assets/asset_keys.js"
import PersistentCooldown from "../../utils/persistent_cooldown.js";


export default class NormalAttack extends Attack
{
    constructor(scene, player){
        super(scene, player, TextureKeys.Punch_Attack)

        // Define collisions with enemies
        this.defineCollisions();

        // Offset distance from the character
        this.offsetX = player.body.width + 5;
        this.offsetY = player.body.height/2;

        this.cooldown = new PersistentCooldown(500);

        this.damage = 2;

        this.setAttackSpriteActive(false);
        this.setAttackColliderActive(false);

        this.on('animationcomplete', this.onAnimationComplete, this);

    }

    /**
	 * @param {number} t - Total time
	 * @param {number} dt - Time between frames
	 */
	preUpdate(t, dt) {
		super.preUpdate(t, dt);

    }

    attack(t)
    {
        this.player.performingAttack = true;

        this.setAttackSpriteActive(true);
        this.setAttackColliderActive(true);

        this.play(AnimationKeys.Normal_Attack);

        this.scene.sound.play(SoundKeys.Normal_Attack, {
            volume: 0.5,
            loop: false,
            rate: 2.5
        });

    }

    defineCollisions()
    {
        this.scene.physics.add.overlap(this, this.enemies, this.hitCallback);
        this.scene.physics.add.overlap(this, this.walls, this.hitWallCallback);
    }

    hitWallCallback(attack, wallSensor)
    {
        attack.setAttackColliderActive(false);

        wallSensor.parentWall.break(attack.player.hasKey);
    }

    onAnimationComplete(anim, frame)
    {
        if (anim.key === AnimationKeys.Normal_Attack) {
            this.setAttackColliderActive(false);
            this.setAttackSpriteActive(false);
            this.player.performingAttack = false;
            this.player.play(AnimationKeys.Player_Idle);
        }
    }
}