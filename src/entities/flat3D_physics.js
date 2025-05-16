
export class Flat3D_Physics {

    /**
     * Phaser's overlap but tyaking the Z axis into account
     * @param {Scene} scene 
     * @param {Flat3D_Entity} obj1 
     * @param {Flat3D_Entity} obj2 
     * @param {Function} callback 
     */
    static addOverlap(scene, obj1, obj2, callback) {

        scene.physics.add.overlap(obj1, obj2, () => {
            if(obj1.flat3D_Position.z === obj2.flat3D_Position.z) {
                callback();
            }
        });
    }
}