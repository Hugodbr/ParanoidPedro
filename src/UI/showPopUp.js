export function showPopup(scene, message, x = undefined, y = undefined) {
    if (!scene.time || typeof scene.time.addEvent !== 'function') {
        console.error("La escena no tiene un sistema de tiempo válido.");
        return;
    }

    // Usar coordenadas predeterminadas si no se proporcionan
    if (x === undefined || y === undefined) {
        const camera = scene.cameras.main;
        x = camera.width / 2;
        y = camera.height / 2;
    }

    // Crear un fondo semi-transparente para el popup
    const popupBackground = scene.add.graphics();
    popupBackground.fillStyle(0x124243, 0.7); // Color con transparencia
    popupBackground.fillRoundedRect(-150, -50, 300, 100, 15); // Tamaño relativo al contenedor

    // Crear un texto para el mensaje
    const popupText = scene.add.text(0, 0, message, {
        fontFamily: 'PixelArt',
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 280 }
    }).setOrigin(0.5);

    // Crear un contenedor para agrupar los elementos
    const popupContainer = scene.add.container(x, y, [popupBackground, popupText]).setScrollFactor(0).setDepth(5);

    // Animación de aparición
    popupContainer.setAlpha(0); // Invisible al inicio
    scene.tweens.add({
        targets: popupContainer,
        alpha: 1,
        duration: 1500, // Duración de la animación de aparición
        ease: 'Power2',
        onComplete: () => {
            popupContainer.destroy();
        }
    });


}