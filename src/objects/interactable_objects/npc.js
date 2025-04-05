import { showPopup } from '../../UI/showPopUp.js';
import { unlock } from '../../scenes/achievements/unlock.js';
import InteractableObjects from './interactable_objects.js';
/**
     * @extends InteractableObjects
     Lo que recibe
     * @param {String} texture - key del sprite del NPC
     * @param {String} dialogues - key del dialogo del NPC
     * 
     Atributos
     * @param {Boolean} isDialogActive  - booleano para saber si esta en dialogo
     * @param {String} achievement - para desbloquear logro
     * @param {Boolean} disappear - para saber si ese NPC se va desaparece o no
     */

export default class NPC extends InteractableObjects {
    constructor(scene, x, y, texture, dialogues, acv, disappear = false) {
        super(scene, x, y, [texture], 120);
    
        this.dialogues = dialogues;
        this.isDialogActive = false;
        this.achievement = acv;

        this.scene.physics.add.existing(this);
        this.scene.add.existing(this);
        this.body.setImmovable(true);
        this.disappear = disappear;
    }

    preUpdate(t, dt) {
        super.preUpdate(t, dt);

    }

    onInteract() {
        if (this.canInteract && !this.isDialogActive) {
            this.isDialogActive = true;
            const dialogos = this.scene.cache.json.get(this.dialogues);

            unlock(this.scene, this.achievement);
            showPopup(this.scene, `Logro <<${this.achievement}>> desloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);

            this.scene.changeToDialogScene({ sceneKey: this.scene.scene.key, dialogos: dialogos });
            if (this.disappear) 
                this.scene.time.delayedCall(500, () => { this.text.destroy(); this.destroy(); });
        }
    }
}

