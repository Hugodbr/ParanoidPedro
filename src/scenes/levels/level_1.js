import Player from '../../objects/player/player.js';
import Crac from '../../objects/enemies/crac.js'
import HealthBar from '../../UI/health_bar.js';
import ExpBar from '../../UI/exp_bar.js';
import Coin from '../../objects/enemies/coin.js';
import Bullet from '../../objects/abilities/shooting/bullet.js';

import Pool from '../../objects/our_pool.js'
import Bob from '../../objects/enemies/bob.js';
import Letus from '../../objects/enemies/letus.js';
import Mutum from '../../objects/enemies/mutum.js'
import Estaka from '../../objects/enemies/estaka.js';
import Turret from '../../objects/abilities/turret.js';
import Statue from '../../objects/scenery/statue.js';
import NPC from '../../objects/interactable_objects/npc.js';
import Door from '../../objects/interactable_objects/door.js';
import DamageArea from '../../objects/abilities/area_damage/damage_area.js';
import PickableObjects from '../../objects/interactable_objects/pickable_objects.js';
import ChangeLevelDoor from '../../objects/interactable_objects/change_level_door.js';
import Rectangle from '../../objects/interactable_objects/rectangle.js';
import Zaro from '../../objects/enemies/zaro.js';
import Spike from '../../objects/scenery/spike.js';
import Retractable_Spike from '../../objects/scenery/retractable_spike.js';
import ExplosiveBullet from '../../objects/abilities/shooting/explosive_bullet.js';
import Drone from '../../objects/abilities/drone.js';
import Plant from '../../objects/enemies/plant.js';

//import Coin from '../../objetos/Enemies/coin.js'
//constante
const SCALE = 4;
/**
 * Escena principal de juego.
 * @extends Phaser.Scene
 */
export default class Animation extends Phaser.Scene {

	constructor() {
		super({ key: 'level1' });
	}
	preload() {

		this.load.tilemapTiledJSON('mapa1', 'assets/map/map_1/mapa_1.json');
		this.load.image('tileset', 'assets/map/map_1/map_tiles.png');
		this.load.json('dialogues', 'assets/dialogues/dialogues_intro.json');
		this.load.json('dialogues_Flush', 'assets/dialogues/dialogues_flush.json');

		this.load.json('level1Memory1', 'assets/dialogues/level1_memory1.json');
		this.load.json('level1Memory2', 'assets/dialogues/level1_memory2.json');
		this.load.json('level1Memory3', 'assets/dialogues/level1_memory3.json');

		this.load.image('Flush', 'assets/character/flush.png');

		//para los dialogos del inicio
		this.load.image('bossGif', 'assets/enemies/joker/joker_cut_scene.gif');

	}

	/**  
	* Creación de los elementos de la escena principal de juego
	*/
	create(data) {
		this.sound.stopAll();
		this.tries = data.tries;
		// #region Entities
		// #region Map

		this.sound.stopAll(); // Detiene todos los sonidos en reproducción
		this.tries = data.tries;

		this.map = this.make.tilemap({ key: 'mapa1', tileWidth: 32, tileHeight: 32 });
		this.tileset = this.map.addTilesetImage('mapTiles', 'tileset1');

		this.sueloLayer = this.map.createLayer('suelo', this.tileset);
		if (!this.sueloLayer) {
			console.error("La capa 'suelo' no se ha creado correctamente.");
		}
		this.paredLayer = this.map.createLayer('pared', this.tileset);
		if (!this.paredLayer) {
			console.error("La capa 'pared' no se ha creado correctamente.");
		}
		this.sueloLayer.setScale(SCALE);
		this.paredLayer.setScale(SCALE);

		//#region puerta

		// la escala de la puerta lo hace en la constructora de la clase door
		this.doorGroup = this.add.group();
		this.doorLayer = this.map.getObjectLayer('Door');
		this.doorLayer.objects.forEach((objD) => {
			const door = new Door(this, objD.x, objD.y,
				objD.name,  // El tipo de puerta ('verticalDoor' o 'horizontalDoor')
				objD.width,  // El tamaño de la puerta en Tiled
				objD.height, // El tamaño de la puerta en Tiled
			);
			// Añadir la puerta al grupo de puertas
			this.doorGroup.add(door);
		});
		//#endregion

		//#region Objetos

		// la escala de la puerta lo hace en la constructora de la clase door
		this.PickableObjects = this.add.group();
		this.objectsLayer = this.map.getObjectLayer('Objects');

		this.objectsLayer.objects.forEach((obj) => {
			if (obj.name == 'key') {
				this.changeKey = new PickableObjects(this, obj.x * SCALE, obj.y * SCALE, obj.name, obj.name);
				this.PickableObjects.add(this.changeKey);
			}
			else if (obj.properties) {
				var dialogProp= obj.properties.find(prop => prop.name === 'dialog')
				var pickable = new PickableObjects(this, obj.x * SCALE, obj.y * SCALE, obj.name, dialogProp.value, dialogProp.value);
				this.PickableObjects.add(pickable);
			}
			
		});

		// #endregion

		// #region Player
		// #region Player Position

		const objectLayer = this.map.getObjectLayer('position');

		const playerPos = objectLayer.objects.find(obj => obj.name == 'playerPosition');

		// Verificar si el objeto fue encontrado
		if (!playerPos) console.log('Position player no encontrado.');
		const playerX = playerPos.x * SCALE;
		const playerY = playerPos.y * SCALE;

		const change = objectLayer.objects.find(obj => obj.name == 'changeLevel');
		this.DoorLevel2 = new ChangeLevelDoor(this, change.x, change.y, 'El comienzo de todo',change.width, change.height);


		// #endregion

		this.player = new Player(this, playerX, playerY);
		this.player.setScale(SCALE);

		// #endregion

		// #region Pools

		const MAX = 300;

		// #region Coins

		let toAdds = [];
		this.coins = new Pool(this, MAX, 'Coin');
		for (let i = 0; i < MAX; i++) {
			let toAdd = new Coin(this, 0, 0, 1);
			toAdds.push(toAdd);
		}
		this.coins.addMultipleEntity(toAdds);

		// #endregion

		// #region Plants

		toAdds = [];
		this.plants = new Pool(this, MAX, 'Plant');
		for (let i = 0; i < MAX; i++) {
			let toAdd = new Plant(this, 0, 0, 1);
			toAdds.push(toAdd);
		}
		this.plants.addMultipleEntity(toAdds);
		
		// #endregion

		// #region Player Bullets

		toAdds = [];
		this.playerBullets = new Pool(this, MAX, 'Bullet');
		for (let i = 0; i < MAX; i++) {
			let toAdd = new Bullet(this, 0, 0, 'Bala2');
			toAdds.push(toAdd);
		}
		this.playerBullets.addMultipleEntity(toAdds);
		this.player.setPool(this.playerBullets);
		// #endregion

		// #region Enemy Bullets

		toAdds = [];
		this.enemyBullets = new Pool(this, MAX, 'Bullet');
		for (let i = 0; i < MAX; i++) {
			let toAdd = new Bullet(this, 0, 0, 'Bala');
			toAdds.push(toAdd);
		}
		this.enemyBullets.addMultipleEntity(toAdds);

		// #endregion

		//#region Enemy Area
		///scene, x, y, radius, damage, duration, scale=4
		toAdds = [];
		this.area = new Pool(this, MAX, 'Area');
		for (let i = 0; i < MAX; i++) {
			let toAdd = new DamageArea(this, 0, 0, 100, 0, '08_expl_anim');
			toAdds.push(toAdd);
		}
		this.area.addMultipleEntity(toAdds);

		toAdds = [];
		this.areaEs = new Pool(this, MAX, 'Area');
		for (let i = 0; i < MAX; i++) {
			let toAdd = new DamageArea(this, 0, 0, 100, 0, '03_expl_anim');
			toAdds.push(toAdd);
		}
		this.areaEs.addMultipleEntity(toAdds);

		toAdds = [];

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
			let toAdd = new ExplosiveBullet(this, 0, 0, 'Bala2', 125, this.areaFE);
			toAdds.push(toAdd);
		}
		this.playerExplosiveBullets.addMultipleEntity(toAdds);

		//comparo si hay otros datos de player, si es asi, actualizo, lo hago aqui porque player necesitara registrar del tipo de bala que es
		if (data.player !== undefined) {
			this.player.newLevelClone(data.player);
		}
		// Guarda la referencia en el registry
		this.registry.set('player', this.player);
		// #endregion

		// #region Enemy
		this.exp = 1;
		this.arrayCracs = [];
		const cracLayer = this.map.getObjectLayer('Crac');
		cracLayer.objects.forEach(obj => {
			if (obj.name === 'Crac') { // Filtra por nombre
				// scene, x, y, player, exp, life, damage, texture
				const crac = new Crac(this, obj.x * SCALE, obj.y * SCALE, this.player, this.exp, 3, 1, "Crac");
				crac.setScale(SCALE);
				crac.setPool(this.enemyBullets);
				// Agregar el Crac a la escena y al array
				//this.add.existing(crac);
				this.arrayCracs.push(crac);
			}
		});

		//console.log(this.arrayCracs); // Depuración

		this.enemies = this.add.group();
		this.enemies.addMultiple(this.arrayCracs);


		this.arrayBobs = [];
		const bobLayer = this.map.getObjectLayer('Bob');
		bobLayer.objects.forEach(obj => {
			if (obj.name === 'Bob') { // Filtra por nombre
				const bob = new Bob(this, obj.x * SCALE, obj.y * SCALE, this.player, this.exp, 5, 1, 'Bob');
				bob.setScale(SCALE);
				this.arrayBobs.push(bob);
			}
		});
		//console.log(this.arrayBobs);

		this.enemies.addMultiple(this.arrayBobs);


		this.arrayLetus = [];
		const letusLayer = this.map.getObjectLayer('Letus');

		letusLayer.objects.forEach(obj => {
			if (obj.name === 'Letus') { // Filtra por nombre
				const letus = new Letus(this, obj.x * SCALE, obj.y * SCALE, this.player, this.exp, 5, 1, 'Letus');
				letus.setScale(SCALE);
				this.arrayLetus.push(letus);
			}
		});
		//console.log(this.arrayLetus);

		this.enemies.addMultiple(this.arrayLetus);

		this.enemies.setDepth(1);
		//#endregion

		//#region rectangles
		this.rectGroup = this.add.group();
		this.rectangleLayer = this.map.getObjectLayer('rectangle');
		this.rectangleLayer.objects.forEach((obj) => {
			const rect = new Rectangle(this, obj.x, obj.y, obj.width, obj.height, this.player);
			rect.setDepth(4); 
			this.rectGroup.add(rect);
		});
		this.rectGroup.setDepth(4);
		//#endregion

		// #region NPC
		const NPCpos = objectLayer.objects.find(obj => obj.name == 'FlushPosition');
		const NPCX = NPCpos.x * SCALE;
		const NPCY = NPCpos.y * SCALE;

		this.Flush = new NPC(this, NPCX, NPCY, 'Flush', 'dialogues_Flush', "Caballero generoso");
		this.Flush.setScale(SCALE);
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

		let drone = new Drone(this, this.player.x, this.player.y, this.player, this.enemies, this.playerBullets);
		this.player.registerDrone(drone);
		// #endregion

		//#region UI

		this.expBar = new ExpBar(this, 20, 30);

		this.healthBar = new HealthBar(this, 20, 10, this.player);

		//#endregion

		// #region Collision
		this.paredLayer.setCollisionByProperty({ collides: true });

		this.physics.add.collider(this.enemies, this.paredLayer);

		this.physics.add.collider(this.player, this.paredLayer);


		//collisiones con la puerta
		this.physics.add.collider(this.player, this.doorGroup);

		this.physics.add.collider(this.enemies, this.doorGroup);


		this.physics.add.collider(this.player, this.Flush);

		//colision player-enemigos
		this.physics.add.collider(this.player.collisionZone, this.enemies, (collisionZone,enemy) => {
			if (enemy.visible) {
				if (enemy.isMutum) enemy.createDamageArea();
				else this.player.knockback(500, enemy);
				this.player.onGotHit(enemy.getDamage());
			}

		});

		//colision bala player-enemigos
		this.physics.add.collider(this.playerBullets.getPhaserGroup(), this.enemies, (playerBullet, enemy) => {
			enemy.onGotHit(playerBullet.getDamage(), this.coins, this.plants);
			// mandaria a la pool de las balas de player otra vez
			playerBullet.destroyBullet(this.playerBullets);
		});
		this.physics.add.collider(this.playerExplosiveBullets.getPhaserGroup(), this.enemies, (playerBullet, enemy) => {
			enemy.onGotHit(playerBullet.getDamage(), this.coins, this.plants);
			// mandaria a la pool de las balas de player otra vez
			playerBullet.destroyBullet(this.playerExplosiveBullets);
		});

		//colision bala enemigos-player
		this.physics.add.collider(this.enemyBullets.getPhaserGroup(), this.player.collisionZone, (enemyBullet, collisionZone) => {
			this.player.knockback(200, enemyBullet);
			this.player.onGotHit(enemyBullet.getDamage());
			// mandaria a la pool de las balas de los enemigos otra vez
			enemyBullet.destroyBullet(this.enemyBullets);
		});

		// colision areas
		this.physics.add.overlap(this.player, this.area.getPhaserGroup(), (player, area) => {
			player.onGotHit(area.getDamage());
		});


		this.physics.add.overlap(this.enemies, this.areaFE.getPhaserGroup(), (enemy, area) => {
			enemy.onGotHit(area.getDamage(), this.coins, this.plants);
		});

		//colision fichas-player
		this.physics.add.collider(this.player.collisionZone, this.coins.getPhaserGroup(), (zone, coin) => {
			this.player.onPlayerCollectedXP(coin.getExp());
			if (this.player.getXpAcu() >= this.player.getXpToLevelUp()) {
				this.player.levelUp();
			}
			coin.destroyCoin(this.coins);
		});

		//colision planta-player
		this.physics.add.collider(this.player.collisionZone, this.plants.getPhaserGroup(), (zone, plant) => {
			this.player.onPlayerCollectedPlant(plant.getLifeRec());
			plant.destroyPlant(this.plants);
		});

		//colision balas-paredes
		this.physics.add.collider(this.playerBullets.getPhaserGroup(), this.paredLayer, (bullet, wall) => {
			bullet.destroyBullet(this.playerBullets);
		});
		this.physics.add.collider(this.playerExplosiveBullets.getPhaserGroup(), this.paredLayer, (bullet, wall) => {
			bullet.destroyBullet(this.playerExplosiveBullets);
		});
		this.physics.add.collider(this.enemyBullets.getPhaserGroup(), this.paredLayer, (bullet, wall) => {
			bullet.destroyBullet(this.enemyBullets);
		});

		//colision balas-puertas
		this.physics.add.collider(this.playerBullets.getPhaserGroup(), this.doorGroup, (bullet, door) => {
			bullet.destroyBullet(this.playerBullets);
		});
		this.physics.add.collider(this.enemyBullets.getPhaserGroup(), this.doorGroup, (bullet, door) => {
			bullet.destroyBullet(this.enemyBullets);
		});
		this.physics.add.collider(this.playerExplosiveBullets.getPhaserGroup(), this.doorGroup, (bullet, door) => {
			bullet.destroyBullet(this.playerExplosiveBullets);
		});

		//colision balas-fichas
		this.physics.add.collider(this.coins, this.playerBullets.getPhaserGroup(), (coin, bullet) => {
			coin.body.setBounce(0);
			bullet.body.setBounce(0);
		});
		// #endregion

		this.cameras.main.startFollow(this.player);

		if (this.tries == 1) {
			const dialogos = this.cache.json.get('dialogues');
			this.changeToDialogScene({ sceneKey: this.scene.key, backgroundType: 'dark', dialogos: dialogos, image:'boss' });
		}

		// #region sonido
		this.MainSample = this.sound.add('level1Audio');
		this.MainSample.setLoop(true);
		this.MainSample.play();
		// #endregion
		

	}
	changeToDialogScene(data) {
		this.scene.launch('Dialog', data);
		this.scene.bringToTop('Dialog');
		this.scene.pause();
	}
	changeToGameover() {
		this.removeListener();
		this.MainSample.stop();
		this.scene.start("gameover", { player: this.player, tries: this.tries, previousScene: this});
	}
	removeListener() {
		this.events.removeAllListeners('Interact');
		this.events.removeAllListeners('IKilledAnEnemy');
		this.events.removeAllListeners('TurretTimeOVer');
		this.events.removeAllListeners('playerRecuperaVida');
	}
	changeToNextLevel() {
		this.removeListener();
		this.MainSample.stop();
		this.scene.start('level2', { player: this.player, tries: this.tries });
	}
	pauseGame() {
		this.scene.launch("Pause", { previousScene: this.scene.key }); // Lanzar la escena de pausa
		this.scene.pause(); // Pausar la escena actual
	}
	resumeGame() {
		this.scene.resume(); // Reanudar la escena actual
		this.scene.stop("Pause"); // Detener la escena de pausa
	}
	/**
	 * metodo auxiliar para colocar el player en la posicion de la llave (para la presentacion)
	 */
	setPlayerToKey() {
		this.player.x = this.changeKey.x - 25;
		this.player.y = this.changeKey.y - 25;
	}
	/**
	 * metodo auxiliar para colocar el player en la posicion de la puerta (para la presentacion)
	 */
	setPlayerToDoor() {
		this.player.x = this.DoorLevel2.x +100;
		this.player.y = this.DoorLevel2.y + 100;
	}
	update(t, dt) {
	}
}
