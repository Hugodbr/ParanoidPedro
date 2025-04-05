import Player from '../../objects/player/player.js';
import Joker from '../../objects/enemies/joker.js'

import HealthBar from '../../UI/health_bar.js';
import ExpBar from '../../UI/exp_bar.js';
import Bullet from '../../objects/abilities/shooting/bullet.js';
import Orb from '../../objects/abilities/shooting/orb.js';
import Card from '../../objects/abilities/card.js';

import Pool from '../../objects/our_pool.js';
import DamageArea from '../../objects/abilities/area_damage/damage_area.js';
import PickableObjects from '../../objects/interactable_objects/pickable_objects.js';
import ExplosiveBullet from '../../objects/abilities/shooting/explosive_bullet.js';
import Drone from '../../objects/abilities/drone.js';
import Turret from '../../objects/abilities/turret.js';
import { unlock } from '../achievements/unlock.js';
import { showPopup } from '../../UI/showPopUp.js';


const SCALE = 1;
export default class BossScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BossScene' });
    }

    /**
    * Preload: Carga todos los recursos necesarios antes de iniciar el juego.
    */
    preload() {
        // Load assets (e.g., boss sprite, animations, and sounds)
        this.load.image('boss', 'assets/enemies/joker/joker.png');
        this.load.image('projectile', '/PVLI-C2024-2025-Grupo7/Juego/assets/bullet/bullet_1.png');

        this.load.image('mapFondo', 'assets/map/map_boss/map_boss_fondo_2.png');
        this.load.image('tapa1', 'assets/map/map_boss/map_boss_1.png');
        this.load.image('tapa2', 'assets/map/map_boss/map_boss_2.png');

        this.load.image('jokerHealthBarBack', 'assets/GUI/healthbar_joker.png');
        this.load.image('jokerHealthBar', 'assets/GUI/health_bar_joker.png');
        
        this.load.tilemapTiledJSON('mapaBoss', 'assets/map/map_boss/boss_map.json');
    }

    /**
    * Creación de los elementos de la escena principal de juego
    */
    create(data) {
        this.sound.stopAll(); // Detiene todos los sonidos en reproducción
        this.tries = data.tries;

        unlock(this, 'Amigo o enemigo?');
        showPopup(this, `Logro <<Amigo o enemigo?>> desloqueado!`, this.scale.width - 175, this.scale.height - 100);

        // #region Map Setup

        const bg = this.add.image(0, 0, 'mapFondo');
        bg.setOrigin(0, 0); 
        bg.setDepth(-1);

        this.mapBoss = this.make.tilemap({ key: 'mapaBoss' });
        if (!this.mapBoss) console.error("La mapa no se ha creado correctamente.");


        //this.paredLayer = this.mapBoss.createLayer('pared', this.tileset);
        //if (!this.paredLayer) console.error("La capa 'pared' no se ha creado correctamente.");

        //this.paredLayer.setScale(SCALE);
        // #endregion

        // #region Player Setup
        // #region Player Position
        const objectLayer = this.mapBoss.getObjectLayer('position');
        if (!objectLayer) console.log('object no encontrado.');

        const playerPos = objectLayer.objects.find(obj => obj.name === 'playerPosition');
        const jokerPos = objectLayer.objects.find(obj => obj.name === 'jokerPosition');

        if (!jokerPos) console.log('Position joker no encontrado.');
        if (!playerPos) console.log('Position player no encontrado.');

        const jokerX = jokerPos.x * SCALE;
        const jokerY = jokerPos.y * SCALE;

        const playerX = playerPos.x * SCALE;
        const playerY = playerPos.y * SCALE;
        // #endregion

        this.player = new Player(this, playerX, playerY, 'player2d');
        this.player.setScale(0.3);
        // #endregion


        // #region Pools Setup
        const MAX = 300;

        // #region Player Bullets
        let toAdds = [];

        this.playerBullets = new Pool(this, MAX, 'Bullet');
        for (let i = 0; i < MAX; i++) {
            let toAdd = new Bullet(this, 0, 0, 'Bala2');
            toAdds.push(toAdd);
        }
        this.playerBullets.addMultipleEntity(toAdds);
        this.player.setPool(this.playerBullets);
        // #endregion

        //pool balas explosivas (francotirador explosivo)
        this.areaFE = new Pool(this, MAX, 'Area');
        for (let i = 0; i < MAX; i++) {
            let toAdd = new DamageArea(this, 0, 0, 100, 0, '30_expl_anim');
            toAdds.push(toAdd);
        }
        this.areaFE.addMultipleEntity(toAdds);

        toAdds = [];
        this.playerExplosiveBullets = new Pool(this, MAX, 'Bullet');
        for (let i = 0; i < MAX; i++) {
            let toAdd = new ExplosiveBullet(this, 0, 0, 'Bala2', 75, this.areaFE);
            toAdds.push(toAdd);
        }
        this.playerExplosiveBullets.addMultipleEntity(toAdds);
        //comparo si hay otros datos de player, si es asi, actualizo, lo hago aqui porque player necesitara registrar del tipo de bala que es
        if (data.player !== undefined) {
            this.player.newLevelClone(data.player);
        }
        // Guarda la referencia en el registry
        this.registry.set('player', this.player);

        this.joker = new Joker(this, jokerX, jokerY, this.player);
        //console.log('joker:', this.joker.x, this.joker.y);


        // #region Enemy Bullets
        toAdds = [];
        this.jokerBullets = new Pool(this, MAX, 'Card');
        for (let i = 0; i < MAX; i++) {
            // scene, damage, speed, bala, scale
            let toAdd = new Bullet(this, 0, 0, 'Card', 0.25);
            toAdds.push(toAdd);
        }
        this.jokerBullets.addMultipleEntity(toAdds);

        const MAXOrbs = 60;
        toAdds = [];
        this.jokerOrbs = new Pool(this, MAXOrbs, 'Orbs');
        for (let i = 0; i < MAXOrbs; i++) {
            const orb = new Orb(this, this.joker, i % 3, 0, this.player);
            orb.setPool(this.jokerOrbs);
            toAdds.push(orb);
        }
        this.jokerOrbs.addMultipleEntity(toAdds);


        toAdds = [];
        this.area = new Pool(this, MAX, '13_expl_anim');
        for (let i = 0; i < MAX; i++) {
            let toAdd = new DamageArea(this, 0, 0, 100, 0, '13_expl_anim');
            toAdds.push(toAdd);
        }
        this.area.addMultipleEntity(toAdds);
        //console.log(this.area);

        this.actOrbs = [];
        this.activeOrbsCount = 0;


        // #region Joker Setup
        this.joker.setScale(0.4);
        this.joker.setPool(this.jokerBullets);
        this.joker.setPool2(this.jokerOrbs);
        this.joker.setDamageArea(this.area);
        this.jokerGroup = this.add.group();
        this.jokerGroup.add(this.joker);

        this.cardDamage = 20;
        // #endregion

        // #endregion

        // #endregion

        // #region Collisions and Interactions
        // Player - Joker
        this.physics.add.overlap(this.player.collisionZone, this.joker, this.onPlayerHit, null, this);

        //this.paredLayer.setCollisionByProperty({ collides: true });

        //this.physics.add.collider(this.joker, this.paredLayer);
        //this.physics.add.collider(this.player, this.paredLayer);

        // Player Bullets - pared
        this.physics.add.collider(this.playerBullets.getPhaserGroup(), this.paredLayer, (bullet, wall) => {
            bullet.destroyBullet(this.playerBullets);
        });
         // Player explosive Bullets - pared
        this.physics.add.collider(this.playerExplosiveBullets.getPhaserGroup(), this.paredLayer, (bullet, wall) => {
            bullet.destroyBullet(this.playerExplosiveBullets);
        });
        // Joker Bullets - pared
        this.physics.add.collider(this.jokerBullets.getPhaserGroup(), this.paredLayer, (bullet, wall) => {
            bullet.destroyBullet(this.jokerBullets);
        });

        // Player - Joker DamageArea
        this.physics.add.collider(this.player, this.area.getPhaserGroup(), (player, area) => {
            player.onGotHit(area.getDamage());
        });
        // Joker - Player DamageArea
        this.physics.add.overlap(this.joker, this.areaFE.getPhaserGroup(), (joker, area) => {
            joker.onGotHit(area.getDamage());
        });

        // Joker - player explosive bullets
        this.physics.add.overlap(this.joker, this.playerExplosiveBullets.getPhaserGroup(), (joker, bullet) => {
            joker.onGotHit(bullet.getDamage());
            bullet.destroyBullet(this.playerExplosiveBullets);
        });

        // Joker - Player
        this.physics.add.overlap(this.player.collisionZone, this.joker, (collisionZone, enemy) => {
            if (enemy.visible) {
                this.player.knockback(500, enemy);
                this.player.onGotHit(enemy.getDamage());
            }
        });
        

        // Joker Bullets - Player
        this.physics.add.collider(this.jokerBullets.getPhaserGroup(), this.player.collisionZone, (bullet, collisionZone) => {
            this.player.knockback(200, bullet);
            this.player.onGotHit(bullet.getDamage());
            bullet.destroyBullet(this.jokerBullets);
        });

        // Player Bullets - Joker
        this.physics.add.overlap(this.playerBullets.getPhaserGroup(), this.joker, (playerBullet, joker) => {
            joker.onGotHit(playerBullet.getDamage());
            playerBullet.destroyBullet(this.playerBullets);
        });

        // Player - Joker Orbs
        this.physics.add.overlap(this.player.collisionZone, this.jokerOrbs.getPhaserGroup(), (collisionZone, orb) => {
            if (this.activeOrbsCount < 0) this.activeOrbsCount = 0;

            this.player.knockback(200, orb);
            this.player.onGotHit(orb.getDamage());
            orb.destroyBullet();
        });

        // #endregion

        // #region utilidades
        toAdds = [];
        this.playerTurret = new Pool(this, 10, 'Turret');
        for (let i = 0; i < 10; i++) {
            let toAdd = new Turret(this, 0, 0, this.enemies);
            toAdd.setPool(this.playerBullets);
            toAdds.push(toAdd);
        }
        this.playerTurret.addMultipleEntity(toAdds);
        this.player.registerTurrets(this.playerTurret);

        let drone = new Drone(this, this.player.x, this.player.y, this.player, this.jokerGroup, this.playerBullets);
        this.player.registerDrone(drone);
		// #endregion

        // #region UI
        this.expBar = new ExpBar(this, 0, 30);
        this.healthBar = new HealthBar(this, 0, 10, this.player);

        this.bossHealthBar = new HealthBar(this, 300, 10, this.joker, 'jokerHealthBarBack', 'jokerHealthBar');
        this.bossHealthBar.container.setScale(1.2);
        // #endregion

        // #region Camera Setup
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.85);
       
        // #endregion

        // #region sonido
        this.MainSample = this.sound.add('jokerAudio');
        this.MainSample.setLoop(true);
        this.MainSample.play();
        // #endregion

        //Paredes Mapa
        this.wallsGroup = this.physics.add.staticGroup();
        this.createWalls();

        this.physics.add.collider(this.player, this.wallsGroup);

        setTimeout(() => this.joker.startBehavior(), 3000);
    }

    createWalls() {
        // (x1, y1) a (x2, y2)
        this.drawWall(1490, 500, 5500, 600); // horizontal arriba
        this.drawWall(650, 1500, 700, 3600); // vertical izquierda
        this.drawWall(1490, 2500, 5500, 2600); // vertical derecha
        this.drawWall(3450, 1400, 3550, 3600); // horizontal abajo
    }

    drawWall(x1, y1, x2, y2) {
        const width = Math.abs(x2 - x1);
        const height = Math.abs(y2 - y1);

        let wall = this.add.rectangle(x1, y1, width, height);
        this.wallsGroup.add(wall);

        // Añadir la colisión estática
        this.physics.world.enable(wall);
    }


    createCards() {
        this.cards = []; // Array para almacenar los pilares

        const objectLayer = this.mapBoss.getObjectLayer('position');
        if (!objectLayer) {
            console.error('Object Layer no encontrado.');
            return;
        }

        const cardPositions = objectLayer.objects.filter(obj => obj.name === 'card');
        if (cardPositions.length < 5) {
            //console.warn('No se encontraron suficientes posiciones para los pilares.');
            return;
        }

        cardPositions.forEach(pos => {
            const card = new Card(this, pos.x * SCALE, pos.y * SCALE, 'Card', 1); 
            this.cards.push(card);
        });

        this.cardsDestroyed = 0; // Contador de pilares destruidos

        // Evento para contar los pilares destruidos
        this.events.on('cardDestroyed', () => {
            this.cardsDestroyed++;
            if (this.cardsDestroyed === 5) {
                this.joker.onGotHit(50); // Inflige daño al Joker
                //console.log("El Joker recibi?daño por la destrucción de todos los pilares.");
            }
        });
    }

    startCardChallenge() {
        this.createCards();

        this.time.addEvent({
            delay: 10000, // 10 segundos
            callback: () => {
                if (this.cardsDestroyed < 5) {
                    // Si no se destruyen todos los pilares, el jugador recibe daño
                    this.player.onGotHit(20);
                    //console.log("El jugador recibi?daño por no destruir todos los pilares.");
                }
            },
            callbackScope: this,
            loop: false
        });

        // Balas en cards
        this.physics.add.overlap(this.playerBullets.getPhaserGroup(), this.cards.map(p => p.body), (bullet, cardBody) => {
            const ca = this.cards.find(c => c.body === cardBody); 
            if (ca) {
                bullet.destroyBullet(this.playerBullets); // Destruye la bala
                ca.onGotHit(1);
            }
        });
        this.physics.add.overlap(this.playerExplosiveBullets.getPhaserGroup(), this.cards.map(p => p.body), (bullet, cardBody) => {
            const ca = this.cards.find(c => c.body === cardBody);
            if (ca) {
                bullet.destroyBullet(this.playerBullets); // Destruye la bala
                ca.onGotHit(1);
            }
        });
        this.physics.add.overlap(this.areaFE.getPhaserGroup(), this.cards.map(p => p.body), (area, cardBody) => {
            const ca = this.cards.find(c => c.body === cardBody);
            if (ca) {
                area.destroyArea(this.areaFE); // Destruye la bala
                ca.onGotHit(1);
            }
        });
    }

    checkActiveOrbs(orb) {
        // Incrementa el contador de orbes activas cada vez que una orbe est?lista
        this.activeOrbsCount++;

        this.actOrbs.push(orb);

        //console.log('activeOrbsCount', this.activeOrbsCount)
        if (this.activeOrbsCount >= 3) {
            this.activeOrbsCount = 0;
            // Cuando haya 3 orbes empieza a moverlas
            this.startOrbsMovement();
        }
    }

    checkActiveCards() {
        this.activeCardsCount--;

        if (this.activeOrbsCount <= 0) {
            this.activeOrbsCount = 0;
            this.joker.onGotHit(this.cardDamage);
            this.activeOrbsCount = 5; // reset para que empiece otra vez
        }
    }

    startOrbsMovement() {
        // Hace que todas las orbes activas se muevan hacia el jugador
        this.actOrbs.forEach(orb => {
            if (orb.isActive) {
                orb.follow = true;  // Indica que las orbes deben empezar a seguir al jugador
                orb.start = false;
            }
        });

        this.actOrbs = [];
    }
    removeListener() {
        this.events.removeAllListeners('Interact');
        this.events.removeAllListeners('IKilledAnEnemy');
        this.events.removeAllListeners('TurretTimeOVer');
        this.events.removeAllListeners('playerRecuperaVida');
    }
    changeToGameover() {
        this.MainSample.stop();
        this.removeListener();
        this.scene.start("gameover", { player: this.player, tries: this.tries, previousScene: this });
    }
    changeToVictory() {
        this.MainSample.stop();
        this.removeListener();
        this.scene.start("victory", { player: this.player, tries: this.tries, previousScene: this });
    }
    pauseGame() {
        this.scene.launch("Pause", { previousScene: this.scene.key }); // Lanzar la escena de pausa
        this.scene.pause(); // Pausar la escena actual
    }
    resumeGame() {
        this.scene.resume(); // Reanudar la escena actual
        this.scene.stop("Pause"); // Detener la escena de pausa
    }
    update(time, delta) {

    }


    onPlayerHit(player, boss) {
        console.log('Player hit by boss');
    }
}
