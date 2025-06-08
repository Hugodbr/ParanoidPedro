import Attack from "./attack.js";

import { TextureKeys, AnimationKeys, SoundKeys } from "../../../assets/asset_keys.js"
import PersistentCooldown from "../../utils/persistent_cooldown.js";

export default class FallAttack extends Attack
{
    constructor(scene, player){
        super(scene, player, TextureKeys.Punch_Attack)

        // Define collisions with enemies // TODO OBJECTS
        this.defineCollisions();

        // Offset distance from the character
        this.offsetX = player.body.width/1.5;
        this.offsetY = player.body.height;

        this.cooldown = new PersistentCooldown(1000);

        this.damage = 2;

        this.hitCallback = this.hitCallback.bind(this);

        this.setAttackSpriteActive(false);
        this.setAttackColliderActive(false);

        scene.anims.create({
            key: AnimationKeys.Fall_Attack,
            frames: scene.anims.generateFrameNumbers(TextureKeys.Aerial_Attack, {start:1, end:1}),
            frameRate: 10,
            repeat: 1
        });

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

        this.play(AnimationKeys.Fall_Attack);

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

    hitCallback(attack, enemy)
    {

        attack.setAttackColliderActive(false);

        enemy.getHit(this.damage);
    }

    // OBS: Returns to run animation
    onAnimationComplete(anim, frame)
    {
        if (anim.key === AnimationKeys.Fall_Attack) {
            this.setAttackColliderActive(false);
            this.setAttackSpriteActive(false);
            this.player.performingAttack = false;
            this.player.play(AnimationKeys.Player_Falling);
        }
    }
}