// ----------------------------------------------------------------------------
//  Constantes & Variables
// ----------------------------------------------------------------------------
const constante = {
    resolucion: [800, 500],
    bsx: 50,
    bsy: 50,
    fps: 60,
    pausa_preparado: 5000
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const objeto = {
    prota: null,
    plataforma: null
};

const scroll = {
    scroll: 0,
    bgScroll: 0,
    scrollThresh: 200,
    scroll_img: new Image(constante.resolucion[0], constante.resolucion[1])
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

const estado = {
    actual: -1,
    gameover: false,
    nivel_superado: false
}

const colores = {
    paredColor: '#9D9D62',
    paredColorOscuro: '#808052',
    sueloColor: '#484848',
    rojo: '#D32111'
}

const sonidos = {
    game_over: new Audio('./audio/gameoveretro.ogg'),
    pacman_dies: new Audio('./audio/pacmandies.ogg'),
    eating_cherry: new Audio('./audio/pacmaneatingcherry.mp3'),
    eating_ghost: new Audio('./audio/pacmaneatinghost.ogg'),
    presentacion: new Audio('./audio/pacmanintermision.ogg')
}

export {
    constante, objeto, scroll, 
    canvas, ctx, marcadores, 
    estado, colores, sonidos
};

