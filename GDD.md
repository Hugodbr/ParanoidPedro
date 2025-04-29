# PARANOID PEDRO - GDD

# Idea:

Paranoid Pedro es un juego de plataformas de acción de un solo jugador en el que el jugador protagoniza a Pedro, un loco conspiranoico que tiene como objetivo escapar del hospital repartiendo leches a todo lo que vea (sanitarios, paredes, etc.).
El juego se inspira en títulos como la saga de Rayman, My Friend Pedro, Sketch Quest (estética) y Assassin’s Creed Chronicles.

# Mecánicas:

## Del jugador

### Movimiento del Personaje:

El jugador será capaz de desplazarse horizontal y verticalmente corriendo y saltando, además podrá rodar por el suelo para pasar por lugares más estrechos o evitar enemigos y saltar por las paredes. También podrá pegar ya sea mientras salta, mientras corre, mientras rueda, mientras cae o mientras está quieto para eliminar enemigos o interactuar con otros objetos destructibles como por ejemplo paredes o carros.

Controls:
A-D: desplazamiento izquierda-derecha
W: salto
J: ataque (en suelo y en aire)
K: rodar en suelo

### Uso de llaves para acceder a nuevas zonas:

Para avanzar en el juego, en ciertas zonas será necesario abrir puertas con llaves, que se obtienen a través de la exploración y/o de derrotar a algún enemigo que la posea. Las llaves son obtenidas automáticamente al derrotarlos.

### Seguimiento de la cámara al personaje:

La cámara seguirá al personaje centrandolo en pantalla.

### Objetos interactuables:

En su mayoría serán destructibles, como las paredes que separan las zonas del juego o los objetos que al pegarlos salen disparados en la dirección del golpe arrollando a los enemigos.

### Sistema de vidas del jugador:

El jugador contará con las clásicas tres vidas, que en el juego se representarán como pelotas anti estrés y por cada golpe de un enemigo perderá una, aunque hay casos excepcionales en los que algunos enemigos pueden acabar con la vida del jugador de un solo golpe o contacto. Opcionalmente podríamos añadir un componente que hiciese que en algunas zonas del juego, donde no haya sigilo y se pretende buscar una dinámica de acción, se quite vida por estar quieto demasiado tiempo (estéticamente simboliza la locura del personaje y la desesperación por salir del hospital)


## De los enemigos

### Los enemigos patrullan el eje X y/o pasillos en el eje Z:

Es probablemente la mecánica más interesante del juego, algunos enemigos tienen rutas por las que patrullan en una zona definida, ya sea de un lado al otro en el plano principal del juego, pero hay otros que a través de pasillos (que son objetos integrados en el mapa de forma que dan un efecto de profundidad), son capaces de patrullar en dos dimensiones, esto está principalmente pensado para enemigos invencibles donde el jugador tenga que adaptarse a una dinámica de sigilo, aprovechando cuando el enemigo esté patrullando dando la espalda al jugador (ya sea en el mismo eje X o porque está avanzando hacia el interior del pasillo en ese eje Z ficticio) para pasar de largo sin ser detectado.

Si un enemigo ve al jugador desde el pasillo porque este pasa por enfrente, este acelerará el paso y saldrá del eje Z y tomará la dirección en la que se encuentra el jugador, si no lo ve al salir del pasillo se mantendrá patrullando en el eje X.

Para desarrollar esta mecánica tan compleja de los enemigos tenemos pensado usar un modelo de árboles de comportamiento para entrelazar de manera más clara las acciones de los enemigos en determinadas circunstancias.

![image](https://github.com/user-attachments/assets/0e245095-ae25-4b39-a347-adb9a1c25e6e)

### Tipos de enemigos

Todos los enemigos pueden patrullar en X y/o Z.
En orden de dificultad y aparecimiento:
Enemigos normales: más fáciles, lentos. Son funcionarios del hospital que intentan agarrar a Pedro y aplicarle la vacuna. Si el jugador no está golpeando de ninguna manera y hay colisión, pierde todas sus vidas pues fue capturado y vuelve al inicio.
Enemigos que disparan proyectiles(pulso 5G): Son de la seguridad del hospital. Si están de cara al jugador se quedan disparando y no se mueven.
Enemigos reptilianos: un poco más rápidos, pero más lentos que el jugador. Daño cuerpo a cuerpo. Sólo reciben daño desde arriba o espalda.
Enemigos inmortales (Alien): no reciben daño, tiene mayor velocidad de desplazamiento, van para el jugador hasta donde pueden y tienen la misma lógica de los enemigos normales, es decir, si colisionan con el jugador este pierde la “run”.



### Los enemigos tienen factor visibilidad con el jugador:

Para que los enemigos vayan a por el jugador estos tienen que estar de cara a él.

Tipos de enemigos

## Del escenario

### Sistema de visibilidad de zonas:

Para avanzar en el juego se deben destruir las paredes que separan a las zonas entre sí (estas paredes son objetos interactuables de los ya mencionados en mecánica del jugador), las zonas con las que todavía no se haya conectado destruyendo las paredes no solo son inaccesibles, sino que tampoco muestran su contenido


### Sistema de pasillos:

Los pasillos son transitables por los enemigos y pueden estar conectados entre sí, de forma que un enemigo puede tanto patrullar de alante a atrás un pasillo (más común) como transitar entre zonas a través de los pasillos. 
Opcionalmente nos gustaría que el jugador también pueda usar este sistema para hacer la animación de entrar en puertas, ascensores, etc.

# Sistemas:

Una vez comentadas las mecánicas y sistemas que incluirá el juego, vamos a definir en detalle lo que hacen:

## Zone-System

Este es el sistema que gestiona la identificación y visibilidad de las distintas zonas del juego, como se ha comentado, el jugador no ve en todo momento todo el mapa, sino que se va descubriendo a medida que se van destruyendo las paredes accediendo a nuevas zonas. Por zona, se entiende a cualquier sección del mapa separada por paredes de las demás.

La organización de este sistema inicia desde *Tiled*, donde se definirá una *layer* por cada bloqueo visual de la zona con el nombre de "zone-*n*-cover", siendo *n* el id (numero) de la zona. Es importante que el id de las zonas sea único. En cada layer de zona es donde se pondrán los tiles que tapan el contenido de la misma (por temas de diseño es posible que algunas zonas estén vacías, es decir, que no tengan cobertura de vista porque se quiere que el jugador vea lo que hay en el otro lado sin romper la pared). 

Aparte de las coberturas, también hay que añadir las paredes, por supuesto, pero estas no se añaden a ninguna layer de zona, sino a la layer del mapa general. Las paredes pueden ser tiles si son indestructibles, pero en caso de tratarse de las destructibles, estas paredes serán objetos de Tiled y tendrán tres atributos muy importantes que serán el estado de la pared (si está rota o no, lo que cambia su Sprite y estado de colisión), el id (*n*) de la zona que separan por un lado y el id de la zona que separan por el otro. En la lógica del juego, se al destruir una pared se harán invisibles las dos layers que referencian los atributos del objeto de la pared destruida, por ejemplo:

```
Wall {
	state: "intact",
	side_A_zone: 2,
	side_B_zone: 3
};
```

Al destruir esta pared las zonas 2 y 3 se harán visibles (puede quedar bien con un tweens que settee la visibilidad a 0). Para gestionar estas colisiones y obtener el objeto de cada layer y manejar su visibilidad, el Zone_System implementado en código tendrá que leer del archivo del tilemap y guardarse una lista de objetos pared `Array<BreakeableWall>` y un mapa de ID's a objetos de layer `Map<number, Phaser.Tilemaps.LayerData>`.

## Flat3D-System

Todas las entidades del juego derivan de `Flat3D_Entity`, clase que contará con atributos de posición en 3D como posición y velocidad 3D, esto para gestionar el movimientos de las entidades, que serán cuerpos kinemáticos para evitar físicas raras sobre todo con la simulación del eje Z y para evitar conflictos en los desplazamientos hechos por IA. Además, esta clase  contará con un atributo muy importante que será el *depth scaling factor*, que se utilizará para escalar el Sprite de cada entidad dependiendo de su profundidad en el eje Z para dar el efecto deseado.

De la mano con esta clase vendrá el manager `Flat3D_Physics_System`, que deberá tener registradas en una lista a todas las entidades para gestionar en su update el movimiento y las colisiones entre la entidades apoyándose en los métodos existentes de Phaser, pero añadiendo el factor de que para que una colisión se esté dando la Z debe ser la misma, el resto sería todo igual. De esta forma en vez de usar `this.physics.add.overlap` se usaría la versión de `Flat3D_Physics_System` (serían también métodos estáticos).

## Path3D-System

Apoyándose en el sistema anterior, este sistema establece una serie de puntos 3D como camino a seguir por las entidades del juego. Cada `Path3D_Point` consta de posición (un vector 3D), el id de la zona en la que se encuentra y un booleano que indica si se trata de un punto de pasillo (`isCorridorPoint`).

La clase `Path3D_System`, será un componente/atributo de las entidades que sigan una ruta, este contendrá la lista de `Paths3D_Point`s, el sentido en el que se está recorriendo el camino, el próximo punto a alcanzar, el punto del camino mas cercano a otro punto dado, etc. Todo esto será accedido deste los árboles de comportamiento de los NPC para desplazarlos a los puntos indicados si es necesario. 

# Dinámicas:

## Acción:

La dinámica principal del juego será la de destruir todo lo que se ponga en frente al más puro estilo Rayman o Pizza Tower, el hecho de que la mayoría de enemigos se vencen de un solo golpe, así como las paredes debe crear una dinámica divertida que a menudo consiste en moverse por el mapa y pulsar el botón de pegar.

## Sigilo:

Como ya se ha mencionado en mecánica hay enemigos invencibles que a demás de matar de un golpe, el jugador no puede matar (como el alien, por ejemplo), en un principio no serán demasiados pero estas zonas de enemigos invencibles se apoyarán en la mecánica del sistema de pasillos para que el jugador tenga que hacer timing con la trayectoria del enemigo y evitar ser visto.
Una idea es queL los enemigos pueden tener distintas velocidades de desplazamiento en Z, lo que significa que los más difíciles no permiten que el jugador pase sin ser percibido solamente con el movimiento horizontal normal, sino que tenga que rodar por el suelo que le hace más deprisa.

## Enemigos:

Ataques enemigos por proyectiles (pulso 5G) obligan al jugador usar mecánicas de rodar para pasar por debajo o saltar por arriba para evitar daño.
Los enemigos inmortales le dan al jugador dos alternativas: sigilo o correr. Al correr para huir, tendrá menos tiempo para pensar y reaccionar a ataques de enemigos más adelante, pues rápidamente lo alcanzará y lo matará.
Los enemigos reptilianos sólo se pueden derrotar saltando y golpeando la cabeza o si están de espalda con cualquier ataque. Cuando están de cara, sus dientes afilados no permiten a uno acercarse sin recibir daño ni infringir.


# Estética:

Para la estética del juego nos inspiramos en el juego Sketch Quest, los gráficos estarán basados en dibujos hechos a mano, trasladando al jugador a una atmósfera más surrealista.

Para que la realización de los gráficos no sea un quebradero de cabeza la idea es diseñar las partes del mapa utilizando una plantilla de cuadrícula y escaneando en dibujo para luego integrarlo en el Tiled, de esta forma nos aseguramos de que los dibujos van a cuadrar siempre con los tiles luego.

La realidad está alterada, tanto el mapa como los enemigos quieren representar y hacer referencia a todas las teorías conspiranoicas (5G letal, teoría anti vacunas, reptilianos, alienígenas, terraplanismo, etc.).

![image](https://github.com/user-attachments/assets/8b58d81f-922f-4ef3-a607-0507f3a93e13)



El mapa está formado por tiles de forma que un tile se corresponde con  cuadro cuadrados del papel de cuadrícula real que se usará para dibujar. Además la altura de los pasillos será generalmente de 4 tiles, es decir 8 cuadrados de alto.

Los pasillos serán imágenes que se integran con el fondo dando sensación de profundidad, sus dimensiones serán generalmente de 8x7 siendo más anchos que altos, el final del pasillo será un cuadrado de 2x2 centrado en horizontal y 3 cuadrados por encima de la base del dibujo.
