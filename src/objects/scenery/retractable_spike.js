import Obstacle from "./obstacle.js";

const RETRACTABLE_SPIKE_DAMAGE = 5;     // Daño por defecto
const DEFAULT_SWAPPING_COOLDOWN = 2000; // Tiempo para cambio de ciclo
/**
* @extends Obstacle
*/
//pinchos dinamicos
export default class RetractableSpike extends Obstacle {
    // Pinchos que se retraen y sacan cada x tiempo haciendo daño al 
    // jugador cuando este entre en contacto estar sacados 
    constructor(scene, x, y, sizeW = 32, sizeH = 32, scale = 4) {
        super(scene, x, y, "Retractable_Spikes");
        this.init(RETRACTABLE_SPIKE_DAMAGE);

        // Estado inicial y configuraci�n
        this.isExtended = false; // Estado del pincho
        this.extensionTime = DEFAULT_SWAPPING_COOLDOWN; // Tiempo entre subidas y bajadas (ms)
        this.setDisplaySize(sizeW * scale, sizeW * scale)

        // Iniciar el movimiento alternante
        this.setDepth(0);

        this.scene.time.addEvent({
            delay: this.extensionTime, // Tiempo entre cada ciclo
            callback: this.toggleSpike,
            callbackScope: this,
            loop: true
        });
    }
    init(damage) {
        super.init(damage);
        this.play('recSpike');
    }

    toggleSpike() { // Alternar entre extenderse y retraerse
        if (this.isExtended) {
            // quitar la colision
            this.body.checkCollision.none = false;
            if (this.anims.currentAnim?.key !== 'recSpike') this.play('recSpike');
        } else {
            // volver a poner
            this.body.checkCollision.none = true;
            this.play('spikeEnd')
        }

        // Cambiar el estado
        this.isExtended = !this.isExtended;
    }
}