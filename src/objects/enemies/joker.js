import { showPopup } from '../../UI/showPopUp.js';
import Character from '../../objects/player/character.js';
import { fire } from "../abilities/shooting/fire.js";
/**
 * @extends Character
 * Clase Joker que hereda de Character
 */
export default class Joker extends Character {
    /**
     * Constructor de Joker
     * @param {Scene} scene - escena en la que aparece
     * @param {number} x - ejeX inicial
     * @param {number} y - ejeY inical
     * @param {Player} player - referencia del player
     */
    constructor(scene, x, y, player){
        super(scene, x, y, 'boss');
        this.scene.add.existing(this);

        // Target para el damageArea y los disparos
        this.target = player;

        //Limites que puede Teletransportar el Joker
        this.minX = 1000;
        this.maxX = 3400; 

        this.minY = 550;
        this.maxY = 2400;

        scene.physics.add.existing(this);

        // Pool de la DamegeArea
        this.poolArea = null;
        this.damageArea = null;

        // Incremento para la velocidad de disparo
        this.shootSpeedStatus = 0;

        // Numero de cartas que puede disparar
        this.bulletCardNumbers = 2;

        this.AreaDamageRange = 200; // Area del DamageArea
        this.AreaDamage = 3; // Daño del DamageArea
        this.duration = 1; // Duracion del DamageArea
        this.explNumber = 1; // El numero de explosiones que hara

        // Tiempo que esta en cada fase
        this.timeP1 = 3000; // 3 segundos
        this.timeP2 = 3000; // 3 segundos
        this.timeP3 = 3000; // 3 segundos

        this.change = true; // Cambiar de fase 1 a la fase 2

        this.maxLife = 700; // Vida maxima del Joker

        //speedFactor,shootCardSpeed, shootSpeed, life, damage, prob
        this.init(200, 300, 500, this.maxLife, 10, 0);

        this.isTeleporting = false;
        this.isChasing = false;
        this.spawnCards = true;

        this.phase = 1; // Fase inicial

        this.timer = this.scene.time.addEvent({
            delay: 3000,
            callback: this.chasing,
            callbackScope: this,
            loop: true
        });

    }

    getLife() {
        return this.life;
    }

    getMaxLife() {
        return this.maxLife;
    }

    startBehavior() {
        this.shootCards(); // Inicial
        this.startPhaseTimer(1); // Inicia la primera fase con el temporizador
    }

    startPhaseTimer(phase) {
        switch (phase) {
            case 1:
                this.phase1();
                break;
            case 2:
                this.phase2();
                break;
            case 3:
                this.phase3();
                break;
            case 4:
                this.phase4();
                break;
        }
    }

    phase1() {
        //console.log('Fase 1');
        this.teleport();
        if (Math.random() < 0.5 || this.phase == 2) {
            //console.log('Orb fase');
            this.spawnOrbs();
        }

        // Configura un temporizador para la siguiente fase
        this.scene.time.addEvent({
            delay: this.timeP1,
            callback: () => this.startPhaseTimer(2), // Pasa a la fase 2
            callbackScope: this
        });
    }

    phase2() {
        //console.log('Fase 2');
        this.isChasing = true;

        // Temporizador para manejar el final de esta fase y transición a la fase 3
        this.scene.time.addEvent({
            delay: this.timeP2,
            callback: () => {
                this.createDamageArea();
                this.isChasing = false;
                this.startPhaseTimer(3); // Pasa a la fase 3
            },
            callbackScope: this
        });
    }

    phase3() {
        //console.log('Fase 3');
        this.teleport();
        this.shootCards();

        // Temporizador para decidir la siguiente fase
        this.scene.time.addEvent({
            delay: this.timeP3,
            callback: () => {
                if (this.phase == 1) {
                    this.startPhaseTimer(4); // Si está en fase 1, pasa a fase 4
                } else {
                    this.startPhaseTimer(1); // Si está en fase 2, regresa a fase 1
                }
            },
            callbackScope: this
        });
    }

    phase4() {
        //console.log('Fase 4');

        // Temporizador para regresar a la fase 1 después de 4 segundos
        this.scene.time.addEvent({
            delay: 4000,
            callback: () => this.startPhaseTimer(1), // Regresa a fase 1
            callbackScope: this
        });
    }

    onGotHit(damage) {
        super.onGotHit(damage);
        //console.log(`Joker golpeado. Vida restante: ${this.life}`);

        // Modificaciones en el DOM
        const animationContainer = document.getElementById('fullscreen-animation');
        const animationFrame = document.getElementById('animation-frame');

        if (animationContainer && animationFrame) {
            animationContainer.style.display = 'block';
            let currentFrame = 0;
            const frames = ['/PVLI-C2024-2025-Grupo7/Juego/assets/map/map_boss/map_boss_1.png', '/PVLI-C2024-2025-Grupo7/Juego/assets/map/map_boss/map_boss_2.png'];

            const interval = setInterval(() => {
                animationFrame.src = frames[currentFrame];
                currentFrame = (currentFrame + 1) % frames.length; // Alterna entre 0 y 1
            }, 10); 

            setTimeout(() => {
                clearInterval(interval);
                animationContainer.style.display = 'none';
            }, 50); 
        }

        if (this.life <= 0) {
            this.scene.changeToVictory();
            this.destroy();
        }
    }
    setDamageArea(area) {
        this.poolArea = area;
    }

    init(speedFactor, shootCardSpeed, shootSpeed, life, damage, prob) {
        this.speedFactor = speedFactor;
        this.shootSpeed = shootSpeed;
        this.shootCardSpeed = shootCardSpeed;
        this.life = life;
        this.damage = damage;
        this.prob = prob;
        this.maxLife = life;
    }
    createDamageArea() {
        //console.log('DMG AREA')
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;

        // Calcular la distancia entre el Joker y el jugador
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Normalizar la dirección
        const directionX = dx / distance;
        const directionY = dy / distance;
        for (let i = 1; i <= this.explNumber; i++) {
            const areaX = this.x + directionX * 400 * i; // 300 px
            const areaY = this.y + directionY * 300 * i;

            this.damageArea = this.poolArea.spawn(areaX, areaY);
            this.damageArea.reset(this.AreaDamageRange, this.AreaDamage, this.duration);
            const sfx = this.scene.sound.add('enemyAreaAudio');
            sfx.play();
        }
    }
 
    // Caminar hacia el jugador
    chasePlayer() {

        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;

        const distance = Math.sqrt(dx * dx + dy * dy);

        const velocityX = (dx / distance) * this.speedFactor;
        const velocityY = (dy / distance) * this.speedFactor;
        this.body.setVelocity(velocityX, velocityY);
    }

    // Teleporta a una posicion aleatoria
    teleport() {
        this.isChasing = false;

        if (!this.isTeleporting) {

            let newDistX = Phaser.Math.Between(this.minX, this.maxX);
            let newDistY = Phaser.Math.Between(this.minY, this.maxY);

            const dx = this.target.x - newDistX;
            const dy = this.target.y - newDistY;

            let distance = Math.sqrt(dx * dx + dy * dy);
            if (distance >100) {
                this.isTeleporting = true;
                // Animación de teleportación
                //this.play('joker_teleport');

                // Después de la animación, teletransporta al Joker
                //this.once('animationcomplete', () => {
                this.x = newDistX;
                this.y = newDistY;
                this.isTeleporting = false;

                //  this.play('joker_idle');
                //});
            }
        }
    }

    chasing() {
        this.isChasing = true;
    }

    // Dispara 2 o mas cartas hacia el jugador
    shootCards() {
        //console.log('disparo joker');
        for (let i = 0; i < 2; i++) {
            //shooter, target, damage, speed, sprite, scale, pool, num, critChance = 0, critMultiplier = 2
            fire(this,
                this.target,
                this.damage + this.damage * 0.2,
                this.shootCardSpeed + this.shootSpeedStatus * this.shootSpeed * 0.2,
                'Card',
                0.5,
                this.pool,
                this.bulletCardNumbers,
                this.prob + this.prob * this.probStatus);
        }

    }

    // Creacion de Orbs
    spawnOrbs() { // fase 3
        this.isChasing = false;
        
        // shooter, target, damage, speed, sprite, scale, pool, num, critChance = 0, critMultiplier = 2
        fire(this,
            this.target,
            this.damage + this.damage * 0.2,
            this.shootSpeed + this.shootSpeedStatus * this.shootSpeed * 0.2,
            'Orbs',
            4,
            this.pool2,
            1,
            this.prob + this.prob * this.probStatus);
    }

    preUpdate(t,dt){
        super.preUpdate(t, dt);
        //console.log('Joker pos X: ', this.x, ' Y: ', this.y)
        if (this.isChasing) {
            this.chasePlayer();
        } else {
            this.body.setVelocity(0,0);
        }

        if (this.life < this.maxLife / 2 && this.spawnCards) {
            this.spawnCards = false;
            this.scene.startCardChallenge();
        }

        if (this.life < this.maxLife * 0.25 && this.change) {
            showPopup(this.scene, 'Fase Joker 2');
            this.change = false;
            this.speedFactor = 400;
            this.phase = 2;
            this.bulletCardNumbers = 3;
            this.shootSpeedStatus = 2;
            this.explNumber = 3;
            this.timeP1 = 2000;
            this.timeP2 = 4000;
            this.timeP3 = 2000;
        }
    }
}