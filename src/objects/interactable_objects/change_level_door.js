
import { showPopup } from "../../UI/showPopUp.js";
import { unlock } from "../../scenes/achievements/unlock.js";
/**
     * @extends InteractableObjects
     Lo que recibe
     * @param {Scene} scene - la escena que esta
     * @param {Number} x - posicion x
     * @param {Number} y - posicion y
     * @param {String} texture - key del sprite del objeto
     * @param {Number} sizeW - ancho del collider de la puerta
     * @param {Number} sizeH - altura del collider de la puerta
     * @param {Number} scale - escala de la mapa
     * @param {String} achievement - parametro para el logro de pasar nivel
     * atributo
     * @param {Boolean} isWaitingInput - controla si se ignora el imput
     */
import InteractableObjects from './interactable_objects.js';
export default class ChangeLevelDoor extends InteractableObjects {
    constructor(scene, x, y, achievement, sizeW = 32, sizeH = 32, scale = 4) {
        super(scene, x * scale, y * scale,'changeDoor', 200, 50);
        
        this.isWaitingInput = true;
        this.achievement = achievement;
        this.setDisplaySize(sizeW * scale, sizeH * scale);
        this.scene.add.existing(this);

        this.scene.physics.add.existing(this);
        this.body.setImmovable(true);
        this.body.setOffset(0, 0);
        this.setOrigin(0, 0);
    }

    onInteract() {
        if (this.canInteract) {
            if (this.scene.player.Inventory.key) {
                unlock(this.scene, this.achievement);
                showPopup(this.scene, `Logro <<${this.achievement}>> desloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
                // Agregar un retraso de 250ms antes de cambiar de escena
                this.scene.time.addEvent({
                    delay: 500, 
                    callback: () => {
                        this.scene.changeToNextLevel();
                    }
                });
            }
            else {
                showPopup(this.scene, "Necesitas una llave para abrir esta puerta.", this.scene.sys.game.canvas.width / 2, 100);
            }
        }
    }
}

