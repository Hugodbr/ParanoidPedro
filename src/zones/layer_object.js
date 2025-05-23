import { TilemapKeys, TilesetNames, LayerNames, TextureKeys, ObjectNames } from '../../assets/asset_keys.js'

/**
 * Class // TODO
 */
export default class LayerObject
{
    /**
     * Count how many unique object types (e.g. zones, walls) exist based on object names.
     * @param {Array<Object>} mapObjects - The map objects array to scan.
     * @returns {number} - Count of unique objects of this type (e.g. "zone1", "zone2" or "wall1", ...).
     */
    static countLayerObjects(mapObjects, type) {
        // Extract zone names from object names
        const names = new Set();

        mapObjects.forEach(obj => {
            if (obj.name?.includes("/")) {
                const name = obj.name.split("/")[0]; // Get 'zone1' from 'zone1/enemies/enemy1'
                if (name?.includes(type))
                    names.add(name);
            }
        });

        // ! DEBUG
        // console.log(`Number of ${type}: ${names.size}`);
        // console.log(`${type} found:`, [...names]);

        return names.size;
    }

    /**
     * @param {Phaser.Scene} scene - scene where it appears
     * @param {number} userID - defined in Tiled as the zone, wall group name number (e.g. zone1 => userID = 1)
     * @param {string} type - zone, wall
     */
    constructor(scene, userID, type) 
    {
        /**
         * The Phaser scene that owns this.
         * @type {Phaser.Scene}
         */
        this.scene = scene;

        /**
         * The numeric ID used to distinguish this zone/wall (e.g., zone1 => 1).
         * @type {number}
         */
        this.userID = userID;

        /**
         * The full group name used to locate layer groups in the Tiled map.
         * @type {string}
         */
        this.groupName = type + userID; // group name in tiled

        /**
         * Layers that have collision
         * @type {Phaser.Tilemaps.TilemapLayer[]}
         */
        this.collisionLayers = [];

        // Initialize the layers
        this.createLayers();
    }

    /**
     * Creates the layers from the map for this.
     * 
     * @remarks -
     * 
     * @returns {void}
     */
    createLayers()
    {
        //* Collision layers
        // Create ground layer
        this.groundLayerName = this.groupName + "/" + LayerNames.Ground;
        this.groundLayer = this.scene.map.createLayer(this.groundLayerName, this.scene.mapTileset, 0, 0);
        console.log(this.groundLayer);
        this.groundLayer.setCollisionByExclusion(-1); // In JSON the index appears as 0

        this.collisionLayers.push(this.groundLayer);

        //* Non collision layers
        // Create backgorund scenery layer
        this.backgroundSceneryLayerName = this.groupName + "/" + LayerNames.BackgroundScenery;
        this.backgroundSceneryLayer = this.scene.map.createLayer(this.backgroundSceneryLayerName, this.scene.mapTileset, 0, 0);
    }

    /**
     * Define collisios between entities and layers
     * 
     * @remarks -
     * 
     * @returns {void}
     */
    defineCollisions(entitiesGroup) 
    {    
        // console.log(entitiesGroup);

        this.collisionLayers.forEach(layer => {
            entitiesGroup.forEach(entityGroup => {
                entityGroup.forEach(entity => {
                    this.scene.physics.add.collider(entity, layer);
                });
            });
        });
    }
}