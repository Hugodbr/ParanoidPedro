# PARANOID PEDRO - GDD

# Idea:

Paranoid Pedro es un juego de plataformas de acción de un solo jugador en el que el jugador protagoniza a Pedro, un loco conspiranoico que tiene como objetivo escapar del hospital repartiendo leches a todo lo que vea (sanitarios, paredes, etc.).
El juego se inspira en títulos como la saga de Rayman, My Friend Pedro, Sketch Quest (estética) y Assassin’s Creed Chronicles.

# Mecánicas:

## Del jugador

### Movimiento del Personaje:

El jugador será capaz de desplazarse horizontal y verticalmente corriendo y saltando, además podrá rodar por el suelo para pasar por lugares más estrechos o evitar enemigos y saltar por las paredes. También podrá pegar ya sea mientras salta, mientras corre, mientras cae o mientras está quieto para eliminar enemigos o interactuar con las paredes destructibles.

Controles:

A-D o Joy-stick izquierdo: desplazamiento izquierda-derecha
W o A (con mando): salto
Espacio o X (con mando): ataque (en suelo y en aire)
S o B (con mando): rodar en suelo

Romper paredes/abrir puertas: golpe normal mientras está quieto.

### Uso de llaves para acceder a nuevas zonas:

Para avanzar en el juego, en ciertas zonas será necesario abrir puertas con llaves, que se obtienen a través de derrotar a algún enemigo que la posea. Las llaves son obtenidas automáticamente al derrotarlos.

### Seguimiento de la cámara al personaje:

La cámara seguirá al personaje centrandolo en pantalla con un offset según la dirección que apunta.

### Objetos interactuables:

Paredes que separan las zonas del juego y item de vida que la rellena.

### Sistema de vidas del jugador:

El jugador conta con un número de vidas discreto. Al tomar daño de los enemigos, en lugar de una UI visual clásica, un sonido de monitor de hospital empezará para avisar que ya no tiene la vida total. La frecuencia del sonido incrementará a cada vez que el jugador perder una vida.


## De los enemigos

### Los enemigos patrullan el eje X y/o pasillos en el eje Z:

Es probablemente la mecánica más interesante del juego, algunos enemigos tienen rutas por las que patrullan en una zona definida, ya sea de un lado al otro en el plano principal del juego, pero hay otros que a través de pasillos (que son objetos integrados en el mapa de forma que dan un efecto de profundidad), son capaces de patrullar en dos dimensiones, de esta forma el jugador puede seguir una dinámica de sigilo, aprovechando cuando el enemigo esté patrullando dando la espalda al jugador (ya sea en el mismo eje X o porque está avanzando hacia el interior del pasillo en ese eje Z ficticio) para pasar de largo sin ser detectado.

Los enemigos solo ven al jugador cuando están fuera del pasillo.

Para desarrollar esta mecánica tan compleja de los enemigos tenemos pensado usar un modelo de árboles de comportamiento para entrelazar de manera más clara las acciones de los enemigos en determinadas circunstancias.

![image](https://github.com/user-attachments/assets/0e245095-ae25-4b39-a347-adb9a1c25e6e)

### Tipos de enemigos

Todos los enemigos pueden patrullar en X y/o Z.
En orden de dificultad y aparecimiento:
Enemigos que disparan proyectiles(pulso 5G): Son de la seguridad del hospital. Si están de cara al jugador se quedan disparando y no se mueven.
Enemigos reptilianos: un poco más rápidos, pero más lentos que el jugador. Daño cuerpo a cuerpo. Reciben daño letal desde arriba, asi que es más práctico matarlos saltanto sobre su cabeza.

### Vida de los enemigos

Cada enemigo tiene su cantidad de vida. Lo golpes infligidos a ellos por el jugador inicían una animación de blinking rojo de los enemigos que le avisa que han perdido vida. La frecuencia del blinking también aumenta a medida que la vida llega a 0.

### Los enemigos tienen factor visibilidad con el jugador:

Para que los enemigos vayan a por el jugador estos tienen que estar de cara a él.

### Spawning y ruta de patrulla de los enemigos

Las posiciones iniciales y las rutas de patrulla son definidas en Tiled y parseadas por código.


## Del escenario

### Sistema de visibilidad de zonas:

Para avanzar en el juego se deben destruir las paredes que separan a las zonas entre sí (estas paredes son objetos interactuables de los ya mencionados en mecánica del jugador), las zonas con las que todavía no se haya conectado destruyendo las paredes no solo son inaccesibles, sino que tampoco muestran su contenido

### Sistema de pasillos:

Los pasillos son transitables por los enemigos y pueden estar conectados entre sí, de forma que un enemigo puede tanto patrullar de alante a atrás un pasillo (más común) como transitar entre zonas a través de los pasillos. 
Opcionalmente nos gustaría que el jugador también pueda usar este sistema para hacer la animación de entrar en puertas, ascensores, etc.


# Sistemas:

Una vez comentadas las mecánicas y sistemas que incluirá el juego, vamos a definir en detalle lo que hacen:

## Zone-Wall-System

Este es el sistema que gestiona la identificación y visibilidad de las distintas zonas del juego, como se ha comentado, el jugador no ve en todo momento todo el mapa, sino que se va descubriendo a medida que se van destruyendo las paredes accediendo a nuevas zonas. Por zona, se entiende a cualquier sección del mapa separada por paredes de las demás.

La organización de este sistema inicia desde *Tiled*, donde se define grupos de zonas y grupos de paredes. Ambos grupos tienen capas de suelo y escenario. El grupo de paredes tiene también una capa de pared que se desactiva al romperla, que es cuando se detecta un overlap del golpe normal con un sensor de colisión. Las puertas con cerradura son paredes especiales que se desactivan si el jugador tiene una llave.

## Flat3D-System

Todas las entidades del juego derivan de `Flat3D_Entity`, clase que contará con atributos de posición en 3D como posición y velocidad 3D, esto para gestionar el movimientos de las entidades, que serán cuerpos kinemáticos para evitar físicas raras sobre todo con la simulación del eje Z y para evitar conflictos en los desplazamientos hechos por IA. Además, esta clase  contará con un atributo muy importante que será el *depth scaling factor*, que se utilizará para escalar el Sprite de cada entidad dependiendo de su profundidad en el eje Z para dar el efecto deseado.

De la mano con esta clase vendrá el manager `Flat3D_Physics_System`, que deberá tener registradas en una lista a todas las entidades para gestionar en su update el movimiento y las colisiones entre la entidades apoyándose en los métodos existentes de Phaser, pero añadiendo el factor de que para que una colisión se esté dando la Z debe ser la misma, el resto sería todo igual. De esta forma en vez de usar `this.physics.add.overlap` se usaría la versión de `Flat3D_Physics_System` (serían también métodos estáticos).

## Path3D-System

Apoyándose en el sistema anterior, este sistema establece una serie de puntos 3D como camino a seguir por las entidades del juego. Cada `Path3D_Point` consta de posición (un vector 3D), el id de la zona en la que se encuentra y un booleano que indica si se trata de un punto de pasillo (`isCorridorPoint`).

La clase `Path3D_System`, será un componente/atributo de las entidades que sigan una ruta, este contendrá la lista de `Paths3D_Point`s, el sentido en el que se está recorriendo el camino, el próximo punto a alcanzar, el punto del camino mas cercano a otro punto dado, etc. Todo esto será accedido deste los árboles de comportamiento de los NPC para desplazarlos a los puntos indicados si es necesario. 

# Dinámicas:

## Acción:

La dinámica principal del juego será la de moverse por las paredes y esquivar proyectiles y ataques enemigos al más puro estilo Rayman o Pizza Tower, las paredes y la estructura del mapa deben crear una dinámica divertida que a menudo consiste en moverse por el mapa y pulsar el botón de pegar.

## Sigilo:

El jugador, excepto para obtener la llave de una puerta, puede optar por seguir una dinámica de sigilo aprovechando la patrulla de los enemigos por los pasillos, donde no pueden verlo.
Una idea es queL los enemigos pueden tener distintas velocidades de desplazamiento en Z, lo que significa que los más difíciles no permiten que el jugador pase sin ser percibido solamente con el movimiento horizontal normal, sino que tenga que rodar por el suelo que le hace más deprisa.

## Enemigos:

Ataques enemigos por proyectiles (pulso 5G) obligan al jugador usar mecánicas de rodar para pasar por debajo o saltar por arriba para evitar daño.
Los enemigos reptilianos sólo se pueden derrotar saltando y golpeando la cabeza. Cuando están de cara, sus dientes afilados no permiten a uno acercarse sin recibir daño.


# Estética:

Para la estética del juego nos inspiramos en el juego Sketch Quest, los gráficos estarán basados en dibujos hechos a mano, trasladando al jugador a una atmósfera más surrealista.

Para que la realización de los gráficos no sea un quebradero de cabeza la idea es diseñar las partes del mapa utilizando una plantilla de cuadrícula y escaneando en dibujo para luego integrarlo en el Tiled, de esta forma nos aseguramos de que los dibujos van a cuadrar siempre con los tiles luego.

La realidad está alterada, tanto el mapa como los enemigos quieren representar y hacer referencia a todas las teorías conspiranoicas (5G letal, teoría anti vacunas, reptilianos, alienígenas, terraplanismo, etc.).

![image](https://github.com/user-attachments/assets/8b58d81f-922f-4ef3-a607-0507f3a93e13)



El mapa está formado por tiles de forma que un tile se corresponde con  cuadro cuadrados del papel de cuadrícula real que se usará para dibujar. Además la altura de los pasillos será generalmente de 4 tiles, es decir 8 cuadrados de alto.

Los pasillos serán imágenes que se integran con el fondo dando sensación de profundidad, sus dimensiones serán generalmente de 8x7 siendo más anchos que altos, el final del pasillo será un cuadrado de 2x2 centrado en horizontal y 3 cuadrados por encima de la base del dibujo.
