/**
 * Clase para manejar el dialog_plugin cuando hay varios dialogos
     * @param {Scene} scene - escena en la que aparece
     * atributos
     * @param {Number} currentDialogueIndex - indice del dialogo actual
     * @param {Object} dialogues -dialogos que se va a mostrar
     * @param {Boolean} isWaitingForInput - contralo si se va ignorar el input o no
     * @param {Boolean} isDialogueActive 
     * 
 */
export default class DialogueManager {
    constructor(scene) {
        this.scene = scene;
        this.dialogPlugin = null;
        this.isDialogueActive = false;
        this.isWaitingForInput = false; 
    }
    initialize(dialogPlugin, dialogues) {

        this.currentDialogueIndex = 0; 
        this.dialogPlugin = dialogPlugin;
        this.dialogues = dialogues;

        if (!this.dialogPlugin.visible) this.dialogPlugin.toggleWindow();

        this.scene.input.on('pointerdown', () => {
            if (this.dialogPlugin.visible && this.isWaitingForInput) {
                this.advanceDialogue();
            }
        });

        this.dialogPlugin.closeBtn.on('pointerdown', () => {
            this.skipDialogue();
        });

        this.isWaitingForInput = false; 
    }

    showDialogue() {
        if (!this.dialogPlugin) {
            console.error("DialogueManager: dialogPlugin no inicializado.");
            return;
        }
        this.isDialogueActive = true;
        this.isWaitingForInput = false;
        const currentDialogue = this.dialogues[this.currentDialogueIndex];
        if (currentDialogue) {
            this.dialogPlugin.setText(
                currentDialogue.text,
                true,                 
                currentDialogue.speaker, 
                currentDialogue.isPlayer  // es player o no
            );
        }

        this.scene.time.delayedCall(500, () => {  // Retraso para el input
            this.isWaitingForInput = true;
        });
    }
    
    advanceDialogue() {
        if (this.currentDialogueIndex < this.dialogues.length) {
            this.currentDialogueIndex++;
            this.showDialogue();
        }
        else {
            this.dialogPlugin.toggleWindow();
            this.isDialogueActive = false;
        }

    }
    skipDialogue() {
        this.currentDialogueIndex = this.dialogues.length; // Salta al final
        this.dialogPlugin.toggleWindow();
        this.isDialogueActive = false;
    }
}
