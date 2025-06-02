import { Enemy } from "./enemy.js";
import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames, AnimationKeys } from '../../assets/asset_keys.js';

export class Agent5G extends Enemy {

    constructor(scene, x, y, z, playerRef, pathPoints) {
        super(scene, x, y, z, playerRef, pathPoints);

        this.setTexture(TextureKeys.Agent5G);

        this.anims.create({
            key: AnimationKeys.Agent5G_Idle,
            frames: this.anims.generateFrameNumbers(TextureKeys.Agent5G, { start: 0, end: 3 }),
            frameRate: 25, // Velocidad de la animación
            repeat: -1    // Animación en bucle
        });

        this.anims.create({
            key: AnimationKeys.Agent5G_Run,
            frames: this.anims.generateFrameNumbers(TextureKeys.Agent5G, { start: 4, end: 10 }),
            frameRate: 25, // Velocidad de la animación
            repeat: -1    // Animación en bucle
        });

        this.anims.create({
            key: AnimationKeys.Agent5G_Shoot,
            frames: this.anims.generateFrameNumbers(TextureKeys.Agent5G, { start: 11, end: 13 }),
            frameRate: 25, // Velocidad de la animación
            repeat: -1    // Animación en bucle
        });

        this.anims.create({
            key: AnimationKeys.Agent5G_Walk,
            frames: this.anims.generateFrameNumbers(TextureKeys.Agent5G, { start: 14, end: 21 }),
            frameRate: 25, // Velocidad de la animación
            repeat: -1    // Animación en bucle
        });

        this.play(AnimationKeys.Agent5G_Idle, true);

        this.setFlipX(true);
    }
    
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

    }
}