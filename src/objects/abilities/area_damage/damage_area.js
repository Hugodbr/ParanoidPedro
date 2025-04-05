/**
 * Constructor de Area de daño
 * @param {Scene} scene - escena en la que aparece
 * @param {number} damage - daño que hace
 * @param {number} x - ejeX inicial
 * @param {number} y- ejeY inical
 * @param {number} radius - radio del area
 */

export default class DamageArea extends Phaser.GameObjects.Sprite { 
    // Area circular que provoca daño para las explosiones
    constructor(scene, x, y, radius, damage, texture) {
        super(scene, x, y, texture);
        this.scene = scene;

        this.damage = damage; 
        this.radius = radius;                   // Radio del area
        this.getRealDamage = false;             // Daño que provoca el area
        this.setDepth(1);
        scene.add.existing(this);

        scene.physics.add.existing(this);

        this.body.setImmovable(true);
       
        this.setDepth(0);

        let timer = this.scene.time.addEvent({
            delay: 300,
            callback: this.changeDamage,
            callbackScope: this,
            loop: true
        });

        this.play(texture);

    }

    changeDamage() {
        this.getRealDamage = true
    }

    reset(radius, damage, duration) {
        this.radius = radius;
        this.damage = damage;
        this.duration = duration;
        this.setDisplaySize(radius * 2, radius * 2);
        this.scene.time.delayedCall(this.duration * 1000, this.destroyArea, [], this);
        this.setVisible(true); 
        this.setActive(true);
    }

    getDamage() {   // Devuelve el daño del area
        if (this.getRealDamage) {
            this.getRealDamage = false;
            return this.damage;    
        }
        else return 0;
    }

    destroyArea(pool = null) {  // Destructor
        if (pool != null) {
            pool.release(this);
        } else {
            this.destroy();
        }
    }
   
}
