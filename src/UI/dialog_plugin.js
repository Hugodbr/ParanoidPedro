/*
 * Código extraído de https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-1/
 * Código extraído de https://gamedevacademy.org/create-a-dialog-modal-plugin-in-phaser-3-part-2/ 
 */

/**
 * Esta clase está pensada para crear cuadros de diálogo
 * Las funciones que empiezan por "_" no deberían llamarse nunca desde otras escenas. Pueden romer cosas.
 */

/**
 * Hemos hecho modificaciones para que ajuste a nuestro juego
 * @param {String} speakerText - hablante, puede ser el narrador, NPC, o player
 * cambio de close button a Skip button
 */
export default class DialogText{

	constructor(scene, opts){
		this.scene = scene;
		this.init(opts);
	}

	init(opts) {
		// Mira si hay parámetros que se pasan, en caso de que no, se usan los por defecto
		if (!opts) opts = {};
		
		// set properties from opts object or use defaults
		this.borderThickness = opts.borderThickness || 3;
		this.borderColor = opts.borderColor || 0x907748;
		this.borderAlpha = opts.borderAlpha || 1;
		this.windowAlpha = opts.windowAlpha || 0.8;
		this.windowColor = opts.windowColor || 0x303030;
		this.windowHeight = opts.windowHeight || 150;
		this.padding = opts.padding || 32;
		this.closeBtnColor = opts.closeBtnColor || 'darkgoldenrod';
		this.dialogSpeed = opts.dialogSpeed || 3;
		this.fontSize = opts.fontSize || 24
		this.fontFamily = opts.fontFamily || undefined
		
		// se usa para animar el texto
		this.eventCounter = 0;
		
		// si la ventana de diálogo se muestra
		this.visible = true;
		
		// texto que hay en la ventana
		this.text;
		
		// texto que se renderizará en la ventana
		this.dialog;
		this.graphics;
		this.closeBtn;


		
		//Crea la ventana de dialogo
		this._createWindow();
	}

	// Método que cierra y abre la ventana de diálogo
	toggleWindow() {
		this.visible = !this.visible;
		if (this.text) 
			this.text.visible = this.visible;
		if (this.graphics) 
			this.graphics.visible = this.visible;
		if (this.closeBtn) {
			this.closeBtn.visible = this.visible;
			if (this.visible) {
				this.closeBtn.setInteractive();
			} else {
				this.closeBtn.disableInteractive();
			}
		}
		if (this.speakerText)
			this.speakerText.visible = this.visible;
		if (this.speakerBorderGraphics)
			this.speakerBorderGraphics.visible = this.visible;
	}

	// con esta función se nos permite añadir texto a la ventana
	// Este método se llamara desde la escena que corresponda
	setText(text, animate, speaker, isPlayer=false) {
		//el parametro animate nos permite saber si el texto sera animado o no
		this.eventCounter = 0;
		
		//se crea un array con cada caracter en la cadena de texto y se 
		// guarda en la propiedad diálogo
		this.dialog = text.split('');

		//se mira si hay otro evento de tiempo corriendo y lo elimina
		if (this.timedEvent) 
			this.timedEvent.remove();

		//esta variable es un string vacio si animate es true, de otra manera es la variable text
		var tempText = animate ? '' : text;
		
		//llama al metodo que calcula la pos del texto y lo crea
		this._setText(tempText, speaker, isPlayer); 

		if (animate) {
			//se crea un evento temporizado
			this.timedEvent = this.scene.time.addEvent({
				//delay indica el tiempo en ms hasta que se empieza el evento      
				delay: 150 - (this.dialogSpeed * 30),
				//se llama a la funcion de animar el texto
				//Cada vez que se llama a la funcion de animar se aumenta el eventCounter
				callback: this._animateText,
				//especifica en qué scope se muestra el texto
				callbackScope: this,
				//el evento se repite
				loop: true
			});
		}
		
	}

	// Consigue el ancho del juego (en funcion del tamaño en la escena) 
	_getGameWidth() {
		return this.scene.sys.game.config.width;
	}

	// Consigue el alto del juego (en funcion del tamaño de la escena) 
	_getGameHeight() {
		return this.scene.sys.game.config.height;
	}

	// Calcula las dimensiones y pos de la ventana en funcion del tamaño de la pantalla de juego
	_calculateWindowDimensions(width, height) {
		var x = this.padding;
		var y = height - this.windowHeight - this.padding;
		var rectWidth = width - (this.padding * 2);
		var rectHeight = this.windowHeight;
		return {
			x,
			y,
			rectWidth,
			rectHeight
		};
	}

	// Crea la ventana interior, donde se muestra el texto 
	_createInnerWindow(x, y, rectWidth, rectHeight) {
		//rellena con el color y alpha especificados en las propiedades
		this.graphics.fillStyle(this.windowColor, this.windowAlpha);
		
		//Se crea el rectangulo pasandole las propiedades de posicion y dimensiones
		this.graphics.fillRect(x + 1, y + 1, rectWidth - 1, rectHeight - 1);
	}

	// Creates the border rectangle of the dialog window
	_createOuterWindow(x, y, rectWidth, rectHeight) {
		//Se usa para especificar el estilo de la linea exterior: grosor, color...
		this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
		
		//permite dibujar un rectangulo sin darle relleno
		this.graphics.strokeRect(x, y, rectWidth, rectHeight);
	}

	// Método que crea la ventana de diálogo
	_createWindow() {
		//Obtenemos las dimensiones del juego
		var gameHeight = this._getGameHeight();
		var gameWidth = this._getGameWidth();

		//Se calcula la dimension de la ventana de diálogo
		var dimensions = this._calculateWindowDimensions(gameWidth, gameHeight);
		this.graphics = this.scene.add.graphics();
		this.graphics.setDepth(this.depth);
		
		//Se crean las ventanas interior y exterior
		this._createOuterWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
		this._createInnerWindow(dimensions.x, dimensions.y, dimensions.rectWidth, dimensions.rectHeight);
		
		this._createCloseModalButton(); //se muestra el boton de cerrar en la ventana
		this._createCloseModalButtonBorder(); // se muestra el borde del boton de cerrar

		//poner el ScrollFactor a 0 para asegurar que no se mueva
		this.graphics.setScrollFactor(0);
		if (this.closeBtn) this.closeBtn.setScrollFactor(0);
	}

	// Con el siguiente código se crea el boton de cerrar la ventana de diálogo
	_createCloseModalButton() {
		var self = this;
		this.closeBtn = this.scene.make.text({
			//se crea el boton con las posiciones x e y siguientes
			// se calculan de forma dinámica para que funcione para diferentes tamaños de pantalla
			x: this._getGameWidth() - this.padding - 35,
			y: 30,
			
			//el boton queda representado como una X con su estilo debajo
			text: 'SKIP',
			style: {
				font: 'bold 20px PixelArt',
				fill: this.closeBtnColor,
				align: 'center'
			}
		});
		this.closeBtn.setInteractive(); //hace interactuable el boton de cierre

		this.closeBtn.on('pointerover', function () {
			this.setTint(0xff0000); //cuando el cursor se encuentra encima se cambia de color
		});
		this.closeBtn.on('pointerout', function () {
			this.clearTint(); //vuelve al color original al quitar el cursor
		});
		this.closeBtn.on('pointerdown', function () {
			self.toggleWindow(); //se llama al método que cierra o muestra la ventana de diálogo
			
			// elimina el game object con el texto y borra el evento
			if (self.timedEvent) 
				self.timedEvent.remove();
			if (self.text) 
				self.text.destroy();
			if (self.speakerText)
				self.speakerText.destroy();
			if (self.speakerBorder)
				self.speakerBorder.destroy();
		});
	}

	// Se crea el borde del botón
	_createCloseModalButtonBorder() {
		var x = this._getGameWidth() - this.padding - 45;
		var y = 25;

		this.graphics.lineStyle(this.borderThickness, this.borderColor, this.borderAlpha);
		//Se crea el borde del botón sin relleno
		this.graphics.strokeRect(x, y, 55, 30);
	}

	// Hace aparecer al texto lentamente en pantalla
	_animateText() {
		this.eventCounter++;
		
		//se va actualizando el texto de nuestro game object llamando a setText
		this.text.setText(this.text.text + this.dialog[this.eventCounter - 1]);
		
		//Cuando eventCounter sea igual a la longitud del texto, se detiene el evento
		if (this.eventCounter === this.dialog.length) {
			this.timedEvent.remove();
		}
	}

	// Calcula la pos del texto en la ventana
	_setText(text, speaker, isPlayer=false) {
		// Resetea el game object del texto si ya estaba seteada la propiedad del texto del plugin
		if (this.text) this.text.destroy();
		if (this.speakerText) this.speakerText.destroy();
		if (this.speakerBorder) this.speakerBorder.destroy();

		var x = this.padding + 20;
		var y = this._getGameHeight() - this.windowHeight - this.padding + 60;


		if (speaker != " ") {
			//posicion donde se va situar el nombre de quien esta hablando
			var speakerX = isPlayer ? this.padding + 30 : this._getGameWidth() - this.padding - 100;
			var speakerY = this._getGameHeight() - this.windowHeight - this.padding + 15;

			this.speakerText = this.scene.make.text({
				x: speakerX,
				y: speakerY,
				text: speaker,
				style: {
					fontSize: this.fontSize,
					fontFamily: this.fontFamily,
					color: '#FFD700',
					align: isPlayer ? 'left' : 'right'
				}
			});
			this._createSpeakerBorder(speakerX, speakerY);
		}
		

		//Crea un game object que sea texto
		this.text = this.scene.make.text({
			x,
			y,
			text,
			style: {
				//se obliga al texto a permanecer dentro de unos limites determinados
				wordWrap: { width: this._getGameWidth() - (this.padding * 2) - 25 },
				fontSize: this.fontSize,
				fontFamily: this.fontFamily
			}
		});

		if (this.text) {
			this.text.setScrollFactor(0);
		}
		if (this.speakerText) {
			this.speakerText.setScrollFactor(0);
		}
	}

	//crear recuadro al rededor del nombre del hablante
	_createSpeakerBorder(x, y) {
		var borderPadding = 5;
		this.speakerBorderGraphics = this.scene.add.graphics();
		this.speakerBorderGraphics.lineStyle(2, 0xFFD700, 1);

		this.speakerBorder= this.speakerBorderGraphics.strokeRect(x - borderPadding, y - borderPadding,
			this.speakerText.width + (borderPadding * 2),
			this.speakerText.height + (borderPadding));

		this.speakerBorderGraphics.setScrollFactor(0);
	}
};