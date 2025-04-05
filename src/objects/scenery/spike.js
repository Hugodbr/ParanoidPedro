import Obstacle from "./obstacle.js";

const SPIKE_DAMAGE = 5;
/**
* @extends Obstacle
*/
//pinchos estaticos
export default class Spike extends Obstacle {
    // Pinchos que hacen daño al jugador cuando entra en contacto con este
    constructor(scene, x, y, sizeW = 32, sizeH = 32, scale = 4) {
        super(scene, x, y, "Spike");
        this.setDisplaySize(sizeW * scale, sizeW * scale)
        this.init(SPIKE_DAMAGE);
    }

    init(damage) {
        super.init(damage);
    }
}