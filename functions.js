import {
    constante,
    objeto,
    scroll,
    canvas,
    ctx,
    marcadores,
    estado,
    colores,
    sonidos,
    pos_ini_jugador
} from './constants.js';

import {
    Plataforma
} from './classes/plataforma.js';

// ----------------------------------------------------------------------------
//  Funciones varias
// ----------------------------------------------------------------------------
function dibuja_scrolls(img1, img2) {
    const resY = constante.resolucion[1];
    scroll.bgScroll += scroll.scroll;

    if (scroll.bgScroll >= resY * 2) scroll.bgScroll = 0;

    ctx.drawImage(img1, 0, 0 + scroll.bgScroll);
    ctx.drawImage(img2, 0, 0 - resY + scroll.bgScroll);
    ctx.drawImage(img1, 0, 0 - resY * 2 + scroll.bgScroll);
    ctx.drawImage(img2, 0, 0 - resY * 3 + scroll.bgScroll);
}

// ----------------------------------------------------------------------------
function dibuja_plataformas() {
    const nro_plataformas = estado.plataformas_visibles.length;

    for (let i = 0; i < nro_plataformas; i ++) {
        let dibujaPlataforma = estado.plataformas_visibles[i];
        if (dibujaPlataforma) dibujaPlataforma.dibuja();
        // console.log(dibujaPlataforma.rect.x, dibujaPlataforma.rect.y);
    }
}

// ----------------------------------------------------------------------------
function reinstanciar_plataformas() {
    const cont = estado.contador_plataformas;
    const topP = constante.plataformas_level_up;

    if (estado.plataformas_visibles.length < constante.max_plataformas && cont < topP) {
        estado.contador_plataformas ++;

        let ancho;
        let x;
        const valor = constante.ancho_plataf_nivel[marcadores.nivel - 1];
        const columnas = Math.floor(constante.resolucion[0] / constante.bsx);

        if (estado.contador_plataformas === topP) {
            ancho = columnas;
            x = 0;
        
        } else {
            x = Math.floor(Math.random() * (columnas - 2));

            if (marcadores.nivel < 9) {
                ancho = Math.floor(Math.random() * (valor[1] - valor[0])) + 2;

            } else {
                ancho = Math.floor(Math.random() * 2) + 2;
            }
        }

        const indiceUltimaPlat = estado.plataformas_visibles.length - 1;
        const ultimaPlataforma = Math.floor(estado.plataformas_visibles[indiceUltimaPlat].rect.y / constante.bsy);
        const espacioEntrePlataformas = Math.floor(Math.random() * 2) + 2;
        const y = ultimaPlataforma - espacioEntrePlataformas;

        // if (estado.contador_plataformas == topP) pulga.plataformaMETA = y;

        let velX_rnd;
        const num_rnd = Math.floor(Math.random() * 99);
        console.log(num_rnd);

        if (num_rnd <= marcadores.nivel * 9 && ancho < columnas - 2) {
            velX_rnd = marcadores.nivel + 1;
            if (x > columnas / 2) x = Math.floor(columnas / 2);

        } else {
            velX_rnd = 0;
        }

        let plataforma = new Plataforma(x, y, ancho, velX_rnd, constante.bsx, constante.bsy);
        estado.plataformas_visibles.push(plataforma);
    }
}

// --------------------------------------------------------------------------
function checkColision(obj1, obj2, corr, dy) {
    return obj1.rect.x + corr < obj2.rect.x + obj2.rect.ancho - corr && 
            obj1.rect.x + obj1.rect.ancho - corr > obj2.rect.x + corr &&
            obj1.rect.y + corr < obj2.rect.y + dy + obj2.rect.alto - corr && 
            obj1.rect.y + obj1.rect.alto - corr > obj2.rect.y + dy + corr;
}

// --------------------------------------------------------------------------
function comprobarNivelSuperado() {
    let puntitosMasGordos = objeto.array_puntitos.length + objeto.array_ptosGordos.length;

    if (objeto.contPuntitosComidos >= puntitosMasGordos) {
        return true;
    } else {
        return false;
    }
}

// --------------------------------------------------------------------------
function elNivelSuperado() {
    if (!estado.nivel_superado) return;

    marcadores.nivel ++;
    marcadores.scoreNivel.innerHTML = `Nivel: ${marcadores.nivel}`;
    estadoFantasmas.ptosComeFruta *= 2;
    objeto.fruta.comido = false;
    estadoFantasmas.duracionAzules -= marcadores.nivel * 1000;
    estado.nivel_superado = false;
    objeto.contPuntitosComidos = 0;
    estado.actual = 3;
    sonidos.presentacion.play();

    if (estadoFantasmas.duracionAzules < 2000) estadoFantasmas.duracionAzules = 2000;

    objeto.puntito.forEach(punto => {
        punto.visible = true;
    });

    objeto.ptoGordo.forEach(gordo => {
        gordo.visible = true;
    });

    setTimeout(() => {
        estado.actual = 1;
        objeto.pacman.revivirPacMan();

        objeto.fantasma[0].revivirFantasmas(3, 8, 0, 0);
        objeto.fantasma[1].revivirFantasmas(5, 8, 1, 0);
        objeto.fantasma[2].revivirFantasmas(9, 8, 2, 1);
        objeto.fantasma[3].revivirFantasmas(11, 8, 3, 1);
    }, 5000);
}

// ---------------------------------------------------------------------
function rejugarNuevaPartida() {
    marcadores.puntos = 0;
    marcadores.scorePtos.innerHTML = `Puntos: ${marcadores.puntos}`;
    marcadores.nivel = 1;
    marcadores.scoreNivel.innerHTML = `Nivel: ${marcadores.nivel}`;
    marcadores.vidas = 3;
    marcadores.scoreVidas.innerHTML = `Vidas: ${marcadores.vidas}`;

    objeto.jugador.rect.x = pos_ini_jugador.x;
    objeto.jugador.rect.y = pos_ini_jugador.y;
    objeto.jugador.move.acelX = 0.0;
    objeto.jugador.move.velY = -20;

    estado.plataformas_visibles = [];
    estado.contador_plataformas = 0;

    const columnas = Math.floor(constante.resolucion[0] / constante.bsx);
    const filas = Math.floor(constante.resolucion[1] / constante.bsy);

    let plataforma = new Plataforma(0, filas - 1, 
        columnas + 1, 0, constante.bsx, constante.bsy);
    
    estado.plataformas_visibles.push(plataforma);
}

// -------------------------------------------------------------------------
function elGameOver() {
    if (estado.actual !== 3) return;

    const gradi = ctx.createLinearGradient(Math.floor(constante.resolucion[0] / 5) + 5, 
        Math.floor(constante.resolucion[1] / 4), Math.floor(constante.resolucion[0] / 5) + 5, 
        Math.floor(constante.resolucion[1] / 1.5));
    gradi.addColorStop(0, 'orangered');
    gradi.addColorStop(1, 'yellow');

    ctx.font = '120px seriff';
    ctx.textAlign = 'center';
    ctx.fillStyle = gradi;
    ctx.fillText('Game Over', Math.floor(constante.resolucion[0] / 2), 
        Math.floor(constante.resolucion[1] / 2));
}

// ------------------------------------------------------------------------
function mostrarMarcadores() {
    if (estado.actual == 0) {

        const gradi = ctx.createLinearGradient(parseInt(resolucion[0] / 5) + 5, 
            parseInt(resolucion[1] / 4), parseInt(resolucion[0] / 5) + 5, parseInt(resolucion[1] / 1.5));
        gradi.addColorStop(0, 'orangered');
        gradi.addColorStop(1, 'yellow');

        ctx.font = '100px seriff';
        ctx.fillStyle = gradi;
        ctx.fillText('Preparado!', parseInt(resolucion[0] / 5) + 5, 
            parseInt(resolucion[1] / 2));
    }

    if (estado.actual == 3) {
        ctx.font = '100px seriff';
        ctx.fillStyle = 'yellow';
        ctx.fillText('Nivel Superado!', parseInt(resolucion[0] / 9) + 5, 
            parseInt(resolucion[1] / 2));
    }

    objeto.fantasma.forEach(fant => {
        if (fant.showPtos) {
            ctx.save();
            ctx.shadowColor = 'orange';
            ctx.shadowBlur = 10;
            ctx.font = '30px seriff';
            ctx.fillStyle = 'orangered';
            ctx.fillText(fant.showx2, fant.showX, fant.showY);
            ctx.restore();
        }
    });

    if (objeto.fruta.showPtos) {
        ctx.save();
        ctx.shadowColor = 'orange';
        ctx.shadowBlur = 10;
        ctx.font = '32px seriff';
        ctx.fillStyle = 'orangered';
        ctx.fillText(estadoFantasmas.ptosComeFruta, objeto.fruta.showX, objeto.fruta.showY);
        ctx.restore();
    }
}

// ------------------------------------------------------------------------
function playSonidos(sonido) {
    sonido.play();
}

function playSonidosLoop(sonido, loop, volumen) {
    sonido.play();
    sonido.loop = loop;
    sonido.volume = volumen;
}

// ------------------------------------------------------------------------
function reescalaCanvas() {
    return;
}

// ------------------------------------------------------------------------
function borraCanvas() {
    // canvas.width = canvas.width;
    // canvas.height = canvas.height;
    ctx.fillStyle = colores.azul_fondo;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

//========================================================================
// Presentacion / Menu Principal
//------------------------------------------------------------------------
function laPresentacion(animaPacMan) {
    ctx.font = '120px seriff';
    ctx.fillStyle = 'orangered';
    ctx.fillText('Pac Clon', parseInt(resolucion[0] / 5) + 5, 
        parseInt(resolucion[1] / 2));

    ctx.font = '30px seriff';
    ctx.fillStyle = 'white';
    ctx.fillText('Pulse INTRO o Nueva Partida para comenzar...', parseInt(resolucion[0] / 9) + 5, 
        resolucion[1] - constante.bsy * 2);

    objeto.pacman.secuenciaPresentacion(animaPacMan);
    objeto.fantasma[1].secuenciaPresentacion();
}

export {
	checkColision,
	comprobarNivelSuperado, elNivelSuperado,
	rejugarNuevaPartida, elGameOver, mostrarMarcadores,
	reescalaCanvas, borraCanvas, laPresentacion,
    playSonidos, playSonidosLoop, dibuja_scrolls,
    reinstanciar_plataformas, dibuja_plataformas
};

