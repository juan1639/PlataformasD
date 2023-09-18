// ----------------------------------------------------------------------------
//  import --> Constantes & variables
// ----------------------------------------------------------------------------
import { 
    constante,
    controles,
    objeto,
    scroll,
    canvas,
    ctx,
    marcadores,
    estado,
    sonidos,
    plataformasImg,
    pos_ini_jugador
} from "./constants.js";

// ----------------------------------------------------------------------------
//  import --> Objetos clases
// ----------------------------------------------------------------------------
import { Plataforma } from './classes/plataforma.js';
import { Jugador } from './classes/jugador.js';

// ----------------------------------------------------------------------------
//  import --> funciones varias
// ----------------------------------------------------------------------------
import {
    dibuja_scrolls,  
    checkColision,
    comprobarNivelSuperado, 
    elNivelSuperado, 
    elGameOver, 
    mostrarMarcadores,
    reescalaCanvas, 
    borraCanvas, 
    laPresentacion,
    playSonidos,
    playSonidosLoop,
    reinstanciar_plataformas,
    dibuja_plataformas,
    rejugarNuevaPartida
} from './functions.js';

// ----------------------------------------------------------------------
//  EVENTOS Touch
// ----------------------------------------------------------------------
document.addEventListener('touchstart', (event) => {
    // console.log(event.target.id, event.targetTouches);
    // console.log(event);

    if (estado.actual === -1) {
        if (event.target.id === 'boton__newGame') {
            estado.actual = 0;  // En juego
            marcadores.botonNewGame.style.display = 'none';
            clearInterval(estado.bucle_prejuego);

            setInterval(() => {
                bucle_principal();
            }, Math.floor(1000 / constante.fps));
        }

    } else if (estado.actual === 3) {
        if (event.target.id === 'boton__newGame') {
            estado.actual = 0;  // En juego
            marcadores.botonNewGame.style.display = 'none';
            rejugarNuevaPartida();
        }
    
    } else if (estado.actual === 0) {
        if (event.target.id === 'boton__le' || event.target.id === 'flecha__le') {
            console.log('izq...');
            controles.touch_izq = true;
            
        } else if (event.target.id === 'boton__ri' || event.target.id === 'flecha__ri') {
            console.log('dcha...');
            controles.touch_dcha = true;

        } else {
            console.log('...');
        }
    }
});

document.addEventListener('touchend', (event) => {
    console.log(event.target.id, event.targetTouches);

    if (estado.actual === 0) {
        if (event.target.id === 'boton__le' || event.target.id === 'flecha__le') {
            console.log('endizq...');
            controles.touch_izq = false;
    
        } else if (event.target.id === 'boton__ri' || event.target.id === 'flecha__ri') {
            console.log('enddcha...');
            controles.touch_dcha = false;
        } else {
            console.log('... ..');
        }
    }
});

// ----------------------------------------------------------------------
//  Funcion Inicializadora
// ----------------------------------------------------------------------
window.onload = () => {
    canvas.width = constante.resolucion[0];
    canvas.height = constante.resolucion[1];

    window.columnas = Math.floor(constante.resolucion[0] / constante.bsx);
    window.filas = Math.floor(constante.resolucion[1] / constante.bsy);
    
    scroll.scroll_img.src = './img/fondo_cielo1.png';
    scroll.scroll_img2.src = './img/fondo_cielo2.png';

    // ----------------------------------------------------
    objeto.jugador = new Jugador(pos_ini_jugador.x, pos_ini_jugador.y);

    let plataforma = new Plataforma(0, filas - 1, 
        columnas + 1, 0, constante.bsx, constante.bsy);
    
    estado.plataformas_visibles.push(plataforma);

    // ---------------------------------------------------------
    //  Bucle PRE-JUEGO
    // ---------------------------------------------------------
    estado.bucle_prejuego = setInterval(() => {
        borraCanvas();

        reinstanciar_plataformas();
        dibuja_scrolls(scroll.scroll_img, scroll.scroll_img2);
        dibuja_plataformas();

    }, Math.floor(1000 / constante.fps));
}

// ----------------------------------------------------------------------
//  BUCLE Principal (en juego)
// ----------------------------------------------------------------------
function bucle_principal() {
    borraCanvas();

    reinstanciar_plataformas();

    if (objeto.jugador) scroll.scroll = objeto.jugador.actualiza();
    dibuja_scrolls(scroll.scroll_img, scroll.scroll_img2);
    dibuja_plataformas();

    if (objeto.jugador) objeto.jugador.dibuja(); 

    elGameOver();
}

