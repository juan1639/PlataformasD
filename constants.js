// ----------------------------------------------------------------------------
//  Constantes & Variables
// ----------------------------------------------------------------------------
const constante = {
    resolucion: [800, 550],
    bsx: 50,
    bsy: 50,
    fps: 60,
    jug_alto: 100,
    gravedad: 1,
    max_plataformas: 5,
    plataformas_level_up: 70,
    ancho_plataf_nivel: [
        [2, 7],
        [2, 6],
        [2, 5],
        [2, 5],
        [2, 5],
        [2, 4],
        [2, 4],
        [2, 4]
    ],
    pausa_preparado: 5000
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const controles = {
    touch_izq: false,
    touch_dcha: false
}

const pos_ini_jugador = {
    x: Math.floor(constante.resolucion[0] / 2),
    y: Math.floor(constante.resolucion[1] - constante.bsy - constante.jug_alto)
}

const objeto = {
    jugador: null
};

const scroll = {
    scroll: 0,
    bgScroll: 0,
    scrollThresh: 200,
    scroll_img: new Image(constante.resolucion[0], constante.resolucion[1]),
    scroll_img2: new Image(constante.resolucion[0], constante.resolucion[1])
}

const plataformasImg = {
    medio: new Image(),
    izq: new Image(),
    dcha: new Image(),
    izqS: new Image(),
    dchaS: new Image(),
    movil: new Image()
}

const jugadorImg = {
    ssheet: new Image()
}

const marcadores = {
    puntos: 0,
    nivel: 1,
    vidas: 3,
    scorePtos: document.getElementById('puntos'),
    scoreNivel: document.getElementById('nivel'),
    scoreVidas: document.getElementById('vidas'),
    botonNewGame: document.getElementById('boton__newGame'),
    contenedorControles: document.getElementById('contenedor2__botonesControl')
}

// ---------------------------------------------------------------------
// estado.actual:
//                  -1 --> Pre-Juego (Presentacion / Menu Principal)
//                   0 --> En juego 
//                   1 --> Nivel superado (entre niveles) 
//                   2 --> Game Over 
//                   3 --> (Post-GameOver) Rejugar?
// ---------------------------------------------------------------------
const estado = {
    bucle_prejuego: null,
    contador_plataformas: 0,
    plataformas_visibles: [],
    actual: -1
}

const colores = {
    azul_fondo: 'rgb(134, 210, 230)',
    blanco_nube: 'rgb(233, 233, 233)'
}

const sonidos = {
    jump: new Audio('./audio/jumpbros.ogg'),
    game_over: new Audio('./audio/gameoveretro.ogg'),
    pacman_dies: new Audio('./audio/pacmandies.ogg'),
    eating_cherry: new Audio('./audio/pacmaneatingcherry.mp3'),
    eating_ghost: new Audio('./audio/pacmaneatinghost.ogg'),
    presentacion: new Audio('./audio/pacmanintermision.ogg')
}

export {
    constante, objeto, scroll, 
    canvas, ctx, marcadores, 
    estado, colores, sonidos,
    plataformasImg, jugadorImg,
    controles, pos_ini_jugador
};

