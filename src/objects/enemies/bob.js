import Enemy from "./enemy.js";
/** 
 * Enemigo basico, ataca cuerpo a cuerpo, y persigue al jugador cuando entra en su area de vision
 * @extends Enemy
 */
export default class Bob extends Enemy{
    constructor(scene, x, y, player, exp, life, damage, texture){
        super(scene, x, y, player, texture, exp);
        this.scene.add.existing(this);
        this.init(100, 0, life, damage, 0);

    }
    init(speedFactor, shootSpeed, life, damage, prob) {
        super.init(speedFactor, shootSpeed, life, damage, prob);
        this.play('BobIdle');
    }
}