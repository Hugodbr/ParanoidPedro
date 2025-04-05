export default class Coin extends Phaser.GameObjects.Sprite {
    /**
     * Coin, fichas que sueltan cuando muere un enemigo, aumenta experiencia del jugador
     * @param {Scene} scene - escena en la que aparece
     * @param {number} exp - experiancia que da la ficha
     * @param {number} active - al principio no esta activo
     */
    constructor(scene, x, y, exp) {
        super(scene, x, y, 'Coin');
        this.setScale(2);
        this.scene = scene;
        this.exp = exp
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);
        this.active = false;

        this.setDepth(1);
        
        this.createRotationTween(); // Crear la animación de giro
    }
    preUpdate(t, dt) {
        super.preUpdate(t, dt);

    }

    getExp() {
        return this.exp;
    }

    setExp(value) {
        this.exp = value;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    destroyCoin(pool) {
        pool.release(this);
    }
    /**
    * Crear una animación de giro para la moneda
    */
    createRotationTween() {
        // Fijar el tamaño del cuerpo antes de iniciar la animación
        this.body.setSize(this.width, this.height); // Tamaño original del sprite
        this.scene.tweens.add({
            targets: this,
            scaleX: 0,           // Escala X a 0 para simular la delgadez en el giro
            duration: 900,       // Duración de la primera mitad del giro
            ease: 'Linear',
            yoyo: true,          // Revertir el giro
            repeat: -1,          // Repetir indefinidamente
            onYoyo: () => {
                this.flipX = !this.flipX; // Cambiar la cara visible de la moneda
            }
        });
    }
}