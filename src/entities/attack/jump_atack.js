import Attack from "./attack.js";

import { TextureKeys, AnimationKeys, SoundKeys } from "../../../assets/asset_keys.js"
import PersistentCooldown from "../../utils/persistent_cooldown.js";

export default class JumpAttack extends Attack
{
    constructor(scene, player){
        super(scene, player, TextureKeys.Punch_Attack)

        // Define collisions with enemies // TODO OBJECTS
        this.defineCollisions();

        // Offset distance from the character
        this.offsetX = player.body.width/2;
        this.offsetY = 0;

        this.damage = 3;

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

        this.play(AnimationKeys.Jump_Attack);

        this.scene.sound.play(SoundKeys.Normal_Attack, {
            volume: 0.5,
            loop: false,
            rate: 2
        });

    }

    defineCollisions()
    {
        this.scene.physics.add.overlap(this, this.enemies, this.hitCallback);
    }

    // OBS: Returns to run animation
    onAnimationComplete(anim, frame)
    {
        if (anim.key === AnimationKeys.Jump_Attack) {
            this.setAttackColliderActive(false);
            this.setAttackSpriteActive(false);
            this.player.performingAttack = false;
            this.player.play(AnimationKeys.Player_Jumping);
        }
    }
}