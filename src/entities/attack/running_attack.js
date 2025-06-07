import Attack from "./attack.js";

import { TextureKeys, AnimationKeys, SoundKeys } from "../../../assets/asset_keys.js"
import PersistentCooldown from "../../utils/persistent_cooldown.js";

export default class RunningAttack extends Attack
{
    constructor(scene, player){
        super(scene, player, TextureKeys.NormalAttack)

        // Define collisions with enemies // TODO OBJECTS
        this.defineCollisions();

        // Offset distance from the character
        this.offsetX = player.body.width/1.5;
        this.offsetY = player.body.height/2;

        this.cooldown = new PersistentCooldown(1000);

        this.hitCallback = this.hitCallback.bind(this);

        this.setAttackSpriteActive(false);
        this.setAttackColliderActive(false);

        scene.anims.create({
            key: AnimationKeys.Running_Attack,
            frames: scene.anims.generateFrameNumbers(TextureKeys.Punch_Attack, {start:0, end:3}),
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

        this.play(AnimationKeys.Running_Attack);

        this.scene.sound.play(SoundKeys.Running_Attack, {
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
        console.log("hit");

        attack.setAttackColliderActive(false);

        enemy.getHit();

        // TODO HIT DAMAGE
    }

    // OBS: Returns to run animation
    onAnimationComplete(anim, frame)
    {
        if (anim.key === AnimationKeys.Running_Attack) {
            this.setAttackColliderActive(false);
            this.setAttackSpriteActive(false);
            this.player.performingAttack = false;
            this.player.play(AnimationKeys.Player_Running);
        }
    }
}