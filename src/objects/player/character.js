//constantes por defecto
const DEFAULT_LIFE = 10;
const DEFAULT_COOLDOWN = 1000;
const DEFAULT_SPEED = new Phaser.Math.Vector2(0,0);
const DEFAULT_SPEEDFACTOR = 400;
const DEFAULT_DAMAGE = 1;
const DEFAULT_SHOOTSPEED = 10;
const DEFAULT_CRIT = 0;

/**
     * @extends Phaser.GameObjects.Sprite
     Lo que recibe
     * @param {Phaser.Scene} scene La escena del juego
     * @param {Number} x - Posicion X
     * @param {Number} y - Posicion Y
     atributos
     * @param {Number} _life - Vida del personaje
     * @param {Number} _damage - daña que inflige el personaje
     * @param {Phaser.Math.Vector2} _speed direccion del movimiento
     * @param {Number} _speedFactor Velocidad de movimiento
     * @param {Number} _shootspeed Velocidad de disparo
     * @param {Number} _prob Probabilidad de ataque cr�tico
     */
export default class Character extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, [type]);
        this.scene.add.existing(this);
        // Inicializar las propiedades por defecto
        this.scene = scene;
        this.type = type;
        this.speed = DEFAULT_SPEED;
        this.speedFactor = DEFAULT_SPEEDFACTOR;
        this.shootSpeed = DEFAULT_SHOOTSPEED;
        this.life = DEFAULT_LIFE;
        this.damage = DEFAULT_DAMAGE;
        this.prob = DEFAULT_CRIT;
        this.pool = null;

    }

    //getters
    getSpeed() {
        return this.speed;
    }
    getDamage() {
        return this.damage;
    }

    // #region metodos
    /** 
     * Funcion para restar vida
     * Para que no sea negativo cojo el maximo entre la resta y el 0
     * @param {Number} damageTaken Daño que va a recibir
     */
    onGotHit(damageTaken) {
        this.setTint(0xff0000); 
        this.life = Math.max(0, this.life - damageTaken);

        this.scene.time.delayedCall(300, () => {
            this.clearTint();
        });
    }
    onDeath() {
        this.destroy(); // Elimina el objeto de la escena
    }

    
    setPool(pool) {
        this.pool = pool;

    }

    setPool2(pool) {
        this.pool2 = pool;
    }
    // #endregion
}
