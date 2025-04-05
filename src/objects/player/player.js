import Character from "./character.js";
import { fire } from "../abilities/shooting/fire.js";
import Inventory from "./inventory.js";

/**
 * @extends Character
 * 
 */
export default class Player extends Character {
    /**
     * Constructor de Player
     * @param {Scene} scene - escena en la que aparece
     * @param {Number} x - coordenada x
     * @param {Number} y - coordenada y
     * @param {String} texture - la textura que se va usar, por defeto es el jugador pixelArt
     * @param {String} scale - se usa para ajustar el body y el collider del player
     * atributos
     * @param {String} name - string que se usa para saber que animacion llamar segun la textura que esta usando 
     * @param {Number} cooldownCont - tiempo de disparo
     * @param {Boolean} canShoot - controla si se puede disparar el jugador
     * @param {Number} bulletNumbers - constrola cuantos proyectiles lanza cada vez que dispara
     * @param {Number} bulletScale - escala a que esta la bala
     * @param {Phaser.GameObjects.Zone} collisionZone - otra zona de colision a parte del body
     * @param {Number} xpToLevelUp - la experiencia que necesita para subir de nivel
     * @param {Number} xpAcumulator - experiancia acumulado
 */
    constructor(scene, x, y, texture = 'player', scale = 4) {
        //heredo de la clase character
        super(scene, x, y, texture);
        this.name = texture;

        //Medidor de tiempo para los disparos
        this.cooldownCont = 0;
        this.canShoot = true;
        this.bulletNumbers = 1;
        this.bulletScale = 4;

        //configurar los atributos correspondientes despues de llamar al constructor del character
        this.init(400, 1250, 20, 2, 0.05);

        // Agregamos fisicas
        scene.physics.add.existing(this);
        if (this.name == 'player') {
            this.body.setSize(16, 8);
            this.body.setOffset(8, 24);
        }
        else {
            this.body.setSize(288, 120);
            this.body.setOffset(0, 360);
        }

        this.collisionZone = scene.add.zone(this.x, this.y, 16 * scale, 32 * scale);
        scene.physics.add.existing(this.collisionZone);


        // Establecer el estado de knockback
        this.isKnockedBack = false;

        // #region Sistema de experiencia
        this.level = 1; 
        this.xpToLevelUp = 5;
        this.xpAcumulator = 0;
        // #endregion
        

        // inventorios
        this.Inventory = new Inventory(this);
        // #region puntos de control status
        this.statusPoint = 0; //status points restantes
        this.abilityPoint = 0; //ability points restantes

        this.turretAvaliable = false;
        this.turretsPool = null;

        this.drone = null;
        this.droneActivated = false;

        this.explosiveBulletsActivated = false;

        this.speedFactorStatus = 0; //+15%
        this.shootSpeedStatus = 0; //+15%
        this.maxLifeStatus = 0; //+n (siendo n maxLifeStatus)
        this.probStatus = 0; //+5%
        this.damageStatus = 0; //+100%
        // #endregion

        this.setDepth(2);

        //input
        // Seteamos las teclas para mover al personaje
        this.wKey = this.scene.input.keyboard.addKey('W'); //saltar
        this.aKey = this.scene.input.keyboard.addKey('A'); //izquierda
        this.sKey = this.scene.input.keyboard.addKey('S'); //parar animaci�n
        this.dKey = this.scene.input.keyboard.addKey('D'); //derecha
        this.eKey = this.scene.input.keyboard.addKey('E'); //interactuar
        this.pKey = this.scene.input.keyboard.addKey('P'); //pausar el juego

        //inputs para la presentacion
        this.xKey = this.scene.input.keyboard.addKey('X'); //saltar el nivel
        this.numPad4 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR); //dar xp
        this.numPad3 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE); //dar hp
        this.numPad1 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE); //teleportarte en donde la llave
        this.numPad2 = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO); //teleportarte en donde la puerta
        // Seteamos mouse
        this.mouse = this.scene.input.activePointer;

        //eventos
        this.scene.events.on("IKilledAnEnemy", () => {
            //console.log("i killed it");
            this.Inventory.addKilledEnemies();
        });

        //eventos
        this.scene.events.on("TurretTimeOVer", (turret) => {
            this.turretsPool.release(turret);
            this.setTurretAvaliable(true);
        });

        this.hitSoundCooldown = false;

    }
    init(speedFactor, shootSpeed, life, damage, prob) {
        this.speedFactor = speedFactor;
        this.shootSpeed = shootSpeed;
        this.life = life;
        this.damage = damage;
        this.prob = prob;
        this.maxLife = life;
    }

    // #region getters para el inventario
    getLevel() {
        return this.level;
    }
    getStatusPoints() {
        return this.statusPoint;
    }
    getAbilityPoints() {
        return this.abilityPoint;
    }
    setKilledEnemy() {
        this.Inventory.addKilledEnemies();
    }
    // #endregion

    //getters
    getDamage() {
        return this.damage;
    }
    getLife() {
        return this.life;
    }
    getMaxLife() {
        return this.maxLife;
    }
    getXpAcu() {
        return this.xpAcumulator;
    }
    getXpToLevelUp() {
        return this.xpToLevelUp;
    }


    setTurretAvaliable(a) {
        this.turretAvaliable = a;
    }

    /*metodo para actualizar los atributos entre niveles*/
    newLevelClone(player) {
        this.init(player.speedFactor, player.shootSpeed, player.life, player.damage, player.prob);
        this.maxLife = player.maxLife;

        //caso cuando pasamos de la escena de muerte al nivel
        if (this.life == 0) {
            this.life = this.maxLife;
        }
        // #region Medidor de tiempo para los disparos
        this.cooldownCont = player.cooldownCont;
        this.canShoot = player.canShoot;
        this.bulletNumbers = player.bulletNumbers;
        this.bulletScale = player.bulletScale;
        // #endregion

        // #region Sistema de experiencia
        this.level = player.level;
        this.xpToLevelUp = player.xpToLevelUp;
        this.xpAcumulator = player.xpAcumulator;
        // #endregion

        // #region inventorios
        this.Inventory = player.Inventory;
        this.Inventory.key = false;
        // #endregion

        // #region puntos de control status
        this.statusPoint = player.statusPoint; //status points restantes
        this.abilityPoint = player.abilityPoint; //ability points restantes

        this.turretAvaliable = player.turretAvaliable;
        this.droneActivated = player.droneActivated;
        this.explosiveBulletsActivated = player.explosiveBulletsActivated;

        if (this.explosiveBulletsActivated) {
            this.changeToExplosive();
        }

        this.speedFactorStatus = player.speedFactorStatus; //+15%
        this.shootSpeedStatus = player.shootSpeedStatus; //+15%
        this.maxLifeStatus = player.maxLifeStatus; //+n (siendo n maxLifeStatus)
        this.probStatus = player.probStatus; //+5%
        this.damageStatus = player.damageStatus; //+100%
        // #endregion
    }


    onGotHit(damage) {
        super.onGotHit(damage); // Aplica daño al jugador
        // Comprobar si el sonido está en cooldown
        if (!this.hitSoundCooldown) {
            const sfx = this.scene.sound.add('playerHitAudio');
            sfx.play();

            // Activar el cooldown
            this.hitSoundCooldown = true;

            // Desactivar el cooldown después de 500ms (0.5 segundos)
            this.scene.time.delayedCall(500, () => {
                this.hitSoundCooldown = false;
            });
        }
        //cambia a escene de Game over
        if (this.life == 0) {
            this.scene.changeToGameover();
        }

    }

    //aumenta la experiencia conseguida cuando se colisiona con una ficha
    onPlayerCollectedXP(value) {
        this.xpAcumulator += value; 
    }

    //cuando colecta una planta recupera su vida
    onPlayerCollectedPlant(value) {
        this.scene.events.emit('playerRecuperaVida', value);
        this.life += value;
        if (this.life > this.maxLife) this.life = this.maxLife;
    }


    knockback(strength, attacker) {
        this.isKnockedBack = true;
        // Calcula el vector de dirección
        const directionX = this.x - attacker.x;
        const directionY = this.y - attacker.y

        // Normaliza la dirección
        let normalized = new Phaser.Math.Vector2(directionX, directionY).normalize();
        //console.log("Knockback speed: " + normalized.x + ", " + normalized.y);
        // Aplica velocidad inicial al cuerpo
        this.body.setVelocity(normalized.x * strength, normalized.y * strength);
        this.collisionZone.body.setVelocity(normalized.x * strength, normalized.y * strength);

        // Detén el movimiento después de un corto tiempo
        this.scene.time.delayedCall(300, () => {
            this.collisionZone.body.setVelocity(0, 0);
            this.body.setVelocity(0, 0); // Detener después del knockback 
            this.isKnockedBack = false;
        });
    }

    levelUp() {
        //se aumenta la vida maxima, y se pone la vida a la maxima
        this.level++;
        this.xpAcumulator = this.xpAcumulator-this.xpToLevelUp;
        this.xpToLevelUp += 1;
        this.maxLife++;
        this.life = this.maxLife;
        //consigue un punto de status
        this.statusPoint++;
        this.Inventory.addLevel();
        if (this.level != 0 && (this.level % 3) - 1 == 0) this.abilityPoint++;
        //console.log(this.abilityPoint);
        const sfx = this.scene.sound.add('levelUpAudio');
        sfx.play();
    }

    
    getANewAbility(ability) {
        switch (ability) {
            case 'Juego de proyectiles I':
            case 'Juego de proyectiles II':
            case 'Juego de proyectiles III': {
                this.bulletNumbers++;
            }
                break;
            case 'Francotirador explosivo I': {
                this.bulletScale += this.bulletScale/2; //aumentar el 50s% del tamaño de la bala
            }
                break;
            case 'Francotirador explosivo II': {
                this.explosiveBulletsActivated = true;
                this.changeToExplosive();
            }
                break;
            case 'Utilidad I': {
                //invocar torreta
               // console.log("invocar torreta");
                this.setTurretAvaliable(true);
            }
                break;
            case 'Utilidad II': {
                //invocar torreta
               // console.log("invocar dron");
                this.setDroneActivated(true);
                this.drone.setVisible(true);
            }
                break;
            default: {
               // console.warn(`Habilidad desconocida: ${ability}`);
                return; // Salir si la habilidad no es válida
            }
        }
        this.abilityPoint--
        this.Inventory.addUsedAbility();
    }
    //funcion para subir un status
    upgrateStatus(status) {
        switch(status){
            case 'speedFactor': {
                this.speedFactorStatus++;
            }
                break;
            case 'shootSpeed': {
                this.shootSpeedStatus++;
            }
                break;
            case 'damage': {
                this.damageStatus++;
            }
                break;
            case 'maxLife': {
                this.maxLifeStatus++;
                this.maxLife += this.maxLifeStatus;
                //console.log('max life: '+ this.maxLife);
            }
                break;
            case 'prob': {
                this.probStatus++;
            }
                break;
        }
        this.statusPoint--;
        this.Inventory.addUsedStatus();
    }

    registerTurrets(turrets) {
        this.turretsPool = turrets;
    }
    registerDrone(drone) {
        this.drone = drone;
        this.drone.setVisible(this.droneActivated);
    }
    setDroneActivated(s) {
        this.droneActivated = s;
    }
    changeToExplosive() {
        this.setPool(this.scene.playerExplosiveBullets);
    }
    /**
     * Bucle principal del personaje, actualizamos su posici�n y ejecutamos acciones seg�n el Input
     * @param {Number} t - Tiempo total
     * @param {Number} dt - Tiempo entre frames
     */
    preUpdate(t, dt) {
        if (this.isKnockedBack) {
            return;
        }

        // Input de teclas
        super.preUpdate(t, dt);

        let animationKey = null; // Clave de la animación actual

        // Lógica de movimiento horizontal
        if (this.aKey.isDown) {
            this.speed.x = -1;
            animationKey = this.name + 'WalkLeft';
            //console.log('Player pos X: ', this.x, ' Y: ', this.y)

        } else if (this.dKey.isDown) {
            this.speed.x = 1;
            animationKey = this.name + 'WalkRight';
            //console.log('Player pos X: ', this.x, ' Y: ', this.y)

        }
        else this.speed.x = 0;

        // Lógica de movimiento vertical
        if (this.wKey.isDown) {
            this.speed.y = -1;
            animationKey = this.name + 'WalkUp';
            //console.log('Player pos X: ', this.x, ' Y: ', this.y)

        } else if (this.sKey.isDown) {
            this.speed.y = 1;
            animationKey = this.name + 'WalkDown';
            //console.log('Player pos X: ', this.x, ' Y: ', this.y)

        }
        else this.speed.y = 0;

        //animacion cuando estea parado
        if (this.speed.x === 0 && this.speed.y === 0) {
            switch (this.anims.currentAnim?.key) {
                case this.name +'IdleLeft':
                case this.name +'WalkLeft':
                    animationKey = this.name + 'IdleLeft';
                    break;
                case this.name +'IdleRight':
                case this.name +'WalkRight':
                    animationKey = this.name + 'IdleRight';
                    break;
                case this.name +'IdleUp':
                case this.name +'WalkUp':
                    animationKey = this.name + 'IdleUp';
                    break;
                case this.name +'IdleDown':
                case this.name +'WalkDown':
                    animationKey = this.name + 'IdleDown';
                    break;
                default:
                    animationKey = this.name + 'IdleDown';
                    break;
            }
        }

        //empezar animacion
        if (animationKey && this.anims.currentAnim?.key !== animationKey) this.play(animationKey);

        //input 
        if (this.eKey.isDown) {
            this.scene.events.emit('Interact');
        }

        if (this.pKey.isDown) {
            this.scene.pauseGame();
        }

        //INPUT PARA LA PRESENTACION
        if (this.xKey.isDown) {
            this.scene.changeToNextLevel();
        }
        if (this.numPad1.isDown) {
            this.scene.setPlayerToKey();
            this.drone.setPosition(this.x-50, this.y-10);
        }
        if (this.numPad2.isDown) {
            this.scene.setPlayerToDoor();
            this.drone.setPosition(this.x + 50, this.y - 10);
        }
        if (this.numPad3.isDown) {
            this.statusPoint++;
        } if (this.numPad4.isDown) {
            this.abilityPoint++;
        }
       //Input de mouse
        if (this.mouse.leftButtonDown()) {
            // Todo esto se debería mover al Shooter
            if (this.cooldownCont < 0) {
                let target = new Phaser.Math.Vector2(this.mouse.x + this.scene.cameras.main.scrollX, this.mouse.y + this.scene.cameras.main.scrollY);
                // Calcula la dirección desde el personaje hacia el cursor
                //let direction = new Phaser.Math.Vector2(target.x - this.x, target.y - this.y).normalize();
                fire(this,
                    target,
                    this.damage + this.damageStatus * this.damage,
                    this.shootSpeed + this.shootSpeedStatus * this.shootSpeed * 0.15,
                    'Bala2',
                    this.bulletScale,
                    this.pool,
                    this.bulletNumbers,
                    this.prob + this.prob * this.probStatus);
                const sfx = this.scene.sound.add('playerAttackAudio');
                sfx.setVolume(0.5); // Cambiar el volumen dinámicamente
                sfx.play();
                this.cooldownCont = this.shootSpeed - this.shootSpeedStatus * this.shootSpeed * 0.15;
            }
        }
        else if (this.mouse.rightButtonDown()) {
            if (this.turretAvaliable) {
                //invocar torreta
                let turret = this.turretsPool.spawn(this.x, this.y, 'Turret');
                turret.setDamage(this.damage);
                turret.setBulletSpeed(this.shootSpeed);
                //marcarla como deshabilitada
                this.setTurretAvaliable(false);
            }
        }

        this.cooldownCont = this.cooldownCont - dt;

        this.speed.normalize();

        //calculo la velocidad teniendome en cuenta los status point de speed factor
        //cada punto de speed factor aumenta el 15% de velocidad
        let finalX = this.speed.x * this.speedFactor * (1 + this.speedFactorStatus*0.15);
        let finalY = this.speed.y * this.speedFactor * (1 + this.speedFactorStatus*0.15);
        this.body.setVelocity(finalX, finalY);

        this.collisionZone.body.setVelocity(finalX, finalY); //MOVER LA ZONA DE COLISION CON EL JUGADOR
        if (this.collisionZone.x != this.x || this.collisionZone.y != this.y) this.collisionZone.setPosition(this.x, this.y);
    }
}