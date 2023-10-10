// ----------------------------------------------------------------------------
//  P L A T A F O R M A S - D   ... By Juan Eguia
// 
//  (Sencillo proyecto de juego de tipo plataformas verticales)
// 
//  Módulos:
// 
//  main.js (este modulo)
//  constants.js
//  functions.js
//  eventosControles.js
// 
//  Carpeta classes:
//      bichos.js
//      jugador.js
//      pajaros.js
//      plataforma.js
// 
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
//  import --> Eventos Controles (Teclado, raton, touch)
// ----------------------------------------------------------------------------
import { 
    controles_touch,
    controles_teclado,
    controles_click
} from "./eventosControles.js";

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
    elNivelSuperado,
    acciones_comunes_nivelSuperado_ReiniciarPartida,
    elGameOver, 
    mostrarMarcadores,
    reescalaCanvas, 
    borraCanvas, 
    laPresentacion,
    playSonidos,
    reinstanciar_plataformas,
    dibuja_plataformas,
    dibuja_bichos,
    dibuja_pajaros,
    rejugarNuevaPartida
} from './functions.js';

// ----------------------------------------------------------------------
function crea_bucle_principal() {
    setInterval(() => {
        bucle_principal();
    }, Math.floor(1000 / constante.fps));

    // ---------------- Crea intervalo Animaciones (Bool) -----------
    setInterval(() => {
        estado.animas ? estado.animas = false : estado.animas = true;

        estado.animaAleteo ++;
        if (estado.animaAleteo >= 20) estado.animaAleteo = 0;
    }, 105);
}

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
        columnas, 0, constante.bsx, constante.bsy);
    
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
    dibuja_bichos();
    dibuja_pajaros();

    if (objeto.jugador) objeto.jugador.dibuja(); 

    elGameOver();
}

export {
    crea_bucle_principal
};

