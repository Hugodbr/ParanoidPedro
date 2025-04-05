import { showPopup } from "../../UI/showPopUp.js";
import { unlock } from "../../scenes/achievements/unlock.js";

/**
 * Clase inventorio, usada principalmente para emitir logros relacionados con el jugador
 */
const MAX_STATUS = 25;
const MAX_ABILITY = 9;
export default class Inventory { 

    constructor(player) {
        this.scene = player.scene;
        this.level = player.level;
        this.usedStatus = 0;
        this.usedAbility = 0;
        this.enemiesKilled = 0;
        this.key = false;
        //completar cuantos objetos hay
        this.objects = [];
        this.createEvents();
    }
    addObject(obj) {
        this.objects.push(obj);
    }
    addKilledEnemies() {
        this.enemiesKilled++;
        this.scene.events.emit('enemyKilled', this.enemiesKilled); // Emitir evento
    }
    addUsedAbility() {
        this.usedAbility++;
        this.scene.events.emit('abilityUsed', this.usedAbility); // Emitir evento
    }
    addUsedStatus() {
        this.usedStatus++;
        this.scene.events.emit('statusUsed', this.usedStatus); // Emitir evento
    }
    addLevel() {
        this.level++;
        this.scene.events.emit('levelUp', this.level); // Emitir evento
    }
    collectKey() {
       // console.log('llave conseguida');
        this.key = true;
    }
    //metodo auxiliar para crear los eventos
    createEvents() {
        // Logros relacionados con enemigos matados
        this.scene.events.on('enemyKilled', (enemiesKilled) => {
            if (enemiesKilled === 50) {
                unlock(this.scene, `La Batalla Comienza`);
                showPopup(this.scene, `Logro <<La Batalla Comienza>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
            if (enemiesKilled === 100) {
                unlock(this.scene, `Asaltante Feroz`);
                showPopup(this.scene, `Logro <<Asaltante Feroz>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
            if (enemiesKilled === 150) {
                unlock(this.scene, `Dominante de la guerra`);
                showPopup(this.scene, `Logro <<Dominante de la guerra>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
            if (enemiesKilled === 200) {
                unlock(this.scene, `Destructor del mundo`);
                showPopup(this.scene, `Logro <<Destructor del mundo>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
        });

        // Logros relacionados con status y habilidades
        this.scene.events.on('statusUsed', (usedStatus) => {
            if (usedStatus === MAX_STATUS) {
                unlock(this.scene, `Julie Pro`);
                showPopup(this.scene, `Logro <<Julie Pro>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
        });

        this.scene.events.on('abilityUsed', (usedAbility) => {
            if (usedAbility === MAX_ABILITY) {
                unlock(this.scene, `Julie Pro Max`);
                showPopup(this.scene, `Logro <<Julie Pro Max>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
        });

        // Logros relacionados con niveles
        this.scene.events.on('levelUp', (level) => {
            if (level === 5) {
                unlock(this.scene, `Cogiendo ritmillo`);
                showPopup(this.scene, `Logro <<Cogiendo ritmillo>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
            if (level === 10) {
                unlock(this.scene, `Buena racha`);
                showPopup(this.scene, `Logro <<Buena racha>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
            if (level === 20) {
                unlock(this.scene, `Mucha fuerza`);
                showPopup(this.scene, `Logro <<Mucha fuerza>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
            if (level === 30) {
                unlock(this.scene, `En la Cima`);
                showPopup(this.scene, `Logro <<En la Cima>> desbloqueado!`, this.scene.scale.width - 175, this.scene.scale.height - 100);
            }
        });
    }

}