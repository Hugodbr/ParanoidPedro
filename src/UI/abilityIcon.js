import { showPopup } from "./showPopUp.js";

//Icono de las habilidades (botones)
export default class AbilityIcon extends Phaser.GameObjects.Sprite {
    /**
 * @extends Phaser.GameObjects.Sprite;
 *    //lo que recibe
     * @param {Scene} scene - escena en la que aparece
     * @param {Number} x - coordenada x
     * @param {Number} y - coordenada y
     * @param {String} unlockedSprite - la palabra clave del sprite
     * @param {String} title - titulo
     * @param {String} info - descripcion de la habilidad
     * @param {Boolean} locked - booleano que indica que esta desbloquedo una habilidad
     * @param {Boolean} previousIsLocked - booleano que indica si la habilidad anterior esta desbloqueada o no
     * @param {Object} player - referencia del player
     * //atributos
     * @param {Phaser.text} titleText - texto del titulo de la habilidad
     * @param {Phaser.text} tooltip - texto de descripcion
 */
    constructor(scene, x, y, title, unlockedSprite, info, locked, previousIsLocked,player) {
        let key = "LockedAbility";
        if (!locked) key = unlockedSprite;
        super(scene, x, y, key);
        // #region atributos
        this.scene = scene;
        this.scale = 0.3;
        this.unlockedSprite = unlockedSprite;
        this.locked = locked;
        this.previousIsLocked = previousIsLocked;
        this.info = info;
        this.title = title;
        this.player = player;

        // Añadir a la escena y hacerle interactivo
        this.scene.add.existing(this);
        this.setInteractive();

        // #endregion

        // Texto del título.
        this.titleText = this.scene.add.text(x, y - 40, title, {
            fontFamily: "PixelArt",
            fontSize: 24,
            color: "#000000",
            align: "center",
        }).setOrigin(0.5);
        this.titleText.visible = true;

        // Tooltip
        this.tooltip = this.scene.add.text(x, y + 40, "", {
            fontFamily: "PixelArt",
            fontSize: 16,
            align: "center",
            wordWrap: {
                width: 250, // Ancho máximo antes de dividir en una nueva línea.
                useAdvancedWrap: true, // Habilita el ajuste avanzado para cortar palabras.
            },
        }).setOrigin(0.5);
        this.tooltip.setVisible(false);

        // efecto de sonido del botón
        const buttonSFX = this.scene.sound.add('buttonPressedAudio');
        buttonSFX.setVolume(0.5);

        // efecto de sonido del botón
        const pointerOverSFX = this.scene.sound.add('pointerOverAudio');
        pointerOverSFX.setVolume(0.5);

        // Eventos de interacción
        this.on('pointerover', () => {
            this.showTooltip();
            pointerOverSFX.play();

        });
        this.on('pointerout', () => this.hideTooltip());

        this.on('pointerdown', () => {
            buttonSFX.play();
            if (this.locked) {
                let avaliablePoints = this.player.getAbilityPoints();
                this.unlockAbility(avaliablePoints);
            }
        });
    }
    /**
     * Setters de posicion.
     */
    X(x) {
        this.x = x;
        this.titleText.x = x;
    }
    Y(y) {
        this.y = y;
        this.titleText.y = y - 50;
    }
    /**
     * Muestra el tooltip al pasar el mouse.
     */
    showTooltip() {
        this.tooltip.setText(this.info);
        this.tooltip.setVisible(true);
    }

    /**
     * Oculta el tooltip cuando el mouse sale del logro.
     */
    hideTooltip() {
        this.tooltip.setVisible(false);
    }
    unlockAbility(p) {
        if (p <=0) {
            showPopup(this.scene, "No se puede activar esta habilidad porque no tienes puntos suficientes");
        }
        else if (this.previousIsLocked) {
            showPopup(this.scene, "Tienes que desbloquear primero la habilidad previa");
        }
        else {
            //lanzo el evento con la habilidad a desloquear y los puntos restantes
            this.player.getANewAbility(this.title);

            const treeData = this.scene.cache.json.get('treeData');

            // Buscar el árbol o nodo correspondiente usando el título
            const treeObj = treeData.find(item => item.title === this.title);

            // Cambiar el estado de "locked"
            treeObj.locked = false;

            // Obtener el nodo siguiente
            const nextTreeObj = treeData.find(item => item.id === treeObj.nextId);
            if (nextTreeObj) {
                nextTreeObj.previousIsLocked = false;

                // Actualizar el objeto visual del siguiente nodo
                const nextIcon = this.scene.abilities[nextTreeObj.id - 1]; // Buscar el ícono del siguiente nodo
                if (nextIcon) {
                    nextIcon.previousIsLocked = false;
                }
            }
            // Guardar los datos actualizados en localStorage
            localStorage.setItem('treeData', JSON.stringify(treeData));

            this.setTexture(this.unlockedSprite);
            this.locked = false;
        }
    }
}
