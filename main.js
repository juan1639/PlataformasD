// ----------------------------------------------------------------------------
//  import --> Constantes & variables
// ----------------------------------------------------------------------------
import { 
    constante,
    objeto,
    scroll,
    canvas,
    ctx,
    marcadores,
    estado,
    sonidos
} from "./constants.js";

// ----------------------------------------------------------------------------
//  import --> funciones varias
// ----------------------------------------------------------------------------
import {
    dibuja_scroll, 
    checkComerFruta, 
    checkColision,
    comprobarNivelSuperado, 
    elNivelSuperado,
    nuevaPartida, 
    elGameOver, 
    mostrarMarcadores,
    reescalaCanvas, 
    borraCanvas, 
    laPresentacion,
    nuevaPartidaLocationReload,
    playSonidos,
    playSonidosLoop
} from './functions.js';

window.onload = () => {
    canvas.width = constante.resolucion[0];
    canvas.height = constante.resolucion[1];
    
    scroll.scroll_img.src = './img/fondo_cielo1.png';

    setInterval(() => {
        bucle_principal();
    }, Math.floor(1000 / constante.fps));
}

function bucle_principal() {
    borraCanvas();

    dibuja_scroll(scroll.scroll_img);
}



