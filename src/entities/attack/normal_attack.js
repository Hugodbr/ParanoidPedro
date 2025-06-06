import Attack from "./attack.js";

import { TextureKeys, AnimationKeys, SoundKeys } from "../../../assets/asset_keys.js"
import PersistentCooldown from "../../utils/persistent_cooldown.js";


export default class NormalAttack extends Attack
{
    constructor(scene, player){
        super(scene, player, TextureKeys.NormalAttack)

        // Define collisions with enemies // TODO OBJECTS
        this.defineCollisions();

        // Offset distance from the character
        this.offsetX = player.body.width/1.1;
        this.offsetY = player.body.height/2;

        this.cooldown = new PersistentCooldown(1000);

        this.hitCallback = this.hitCallback.bind(this);

        this.setAttackSpriteActive(false);
        this.setAttackColliderActive(false);

        scene.anims.create({
			key: AnimationKeys.Normal_Attack,
			frames: scene.anims.generateFrameNumbers(TextureKeys.Punch_Attack, {start:0, end:0}),
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
        this.performing = true;

        this.setAttackSpriteActive(true);
        this.setAttackColliderActive(true);

        this.play(AnimationKeys.Normal_Attack);

        this.scene.sound.play(SoundKeys.Normal_Attack, {
            volume: 1,
            loop: false,
            rate: 2.5
        });

    }

    defineCollisions()
    {
        this.scene.physics.add.overlap(this, this.enemies, this.hitCallback);
        this.scene.physics.add.overlap(this, this.walls, this.hitWallCallback);
    }

    hitCallback(attack, enemy)
    {
        console.log("hit");

        attack.setAttackColliderActive(false);

        enemy.getHit();

        // TODO HIT DAMAGE
    }

    hitWallCallback(attack, wallSensor)
    {
        console.log("wall hit");

        attack.setAttackColliderActive(false);

        wallSensor.parentWall.break();
    }

    onAnimationComplete(anim, frame)
    {
        if (anim.key === AnimationKeys.Normal_Attack) {
            this.setAttackSpriteActive(false);
            this.performing = false;
        }
    }
}