import {
    constante,
    objeto,
    scroll,
    canvas,
    ctx,
    marcadores,
    estado,
    sonidos
} from './constants.js';

// ----------------------------------------------------------------------------
//  Funciones varias
// ----------------------------------------------------------------------------
function dibuja_scrolls(imagen) {
    const resY = constante.resolucion[1];
    ctx.drawImage(imagen, 0, 0 + scroll.bgScroll);
    ctx.drawImage(imagen, 0, 0 - resY + scroll.bgScroll);
}

// --------------------------------------------------------------------------
function checkComerFruta() {
    let corr = 5;

    if (checkColision(objeto.fruta, objeto.pacman, corr) && estado.actual == 1 && !objeto.fruta.comido) {
        objeto.fruta.comido = true;
        objeto.fruta.showPtos = true;
        objeto.fruta.showX = objeto.fruta.x 
        objeto.fruta.showY = objeto.fruta.y
        playSonidos(sonidos.eating_cherry);

        marcadores.puntos += estadoFantasmas.ptosComeFruta;

        setTimeout(() => {
            objeto.fruta.showPtos = false;

            setTimeout(() => {
                objeto.fruta.comido = false
                objeto.fruta.x = 9 * constante.bsx;
                objeto.fruta.y = 11 * constante.bsy;
            }, 9000);

        }, 3000);
    }
}

// --------------------------------------------------------------------------
function checkColision(obj1, obj2, corr) {
    return obj1.x + corr < obj2.x + obj2.ancho - corr && 
            obj1.x + obj1.ancho - corr > obj2.x + corr &&
            obj1.y + corr < obj2.y + obj2.alto - corr && 
            obj1.y + obj1.alto - corr > obj2.y + corr;
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

// -------------------------------------------------------------------------
function nuevaPartidaLocationReload() {
    if (estado.gameover || estado.actual == 0) location.reload();
}

function nuevaPartida() {
    estado.actual = 0;
    estado.gameover = false;

    marcadores.puntos = 0;
    marcadores.scorePtos.innerHTML = `Puntos: ${marcadores.puntos}`;
    marcadores.nivel = 1;
    marcadores.scoreNivel.innerHTML = `Nivel: ${marcadores.nivel}`;
    marcadores.vidas = 3;
    marcadores.scoreVidas.innerHTML = `Vidas: ${marcadores.vidas}`;

    estadoFantasmas.ptosComeFruta = 200;
    objeto.fruta.comido = false;
    estadoFantasmas.duracionAzules = 8000;
    estado.nivel_superado = false;
    objeto.contPuntitosComidos = 0;

    objeto.puntito.forEach(punto => {
        punto.visible = true;
    });

    objeto.ptoGordo.forEach(gordo => {
        gordo.visible = true;
    });

    objeto.pacman.revivirPacMan();

    objeto.fantasma[0].revivirFantasmas(3, 8, 0, 0);
    objeto.fantasma[1].revivirFantasmas(5, 8, 1, 0);
    objeto.fantasma[2].revivirFantasmas(9, 8, 2, 1);
    objeto.fantasma[3].revivirFantasmas(11, 8, 3, 1);
}

// -------------------------------------------------------------------------
function elGameOver() {
    if (!estado.gameover) return;

    const gradi = ctx.createLinearGradient(parseInt(resolucion[0] / 5) + 5, 
        parseInt(resolucion[1] / 4), parseInt(resolucion[0] / 5) + 5, parseInt(resolucion[1] / 1.5));
    gradi.addColorStop(0, 'orangered');
    gradi.addColorStop(1, 'yellow');

    ctx.font = '100px seriff';
    ctx.fillStyle = gradi;
    ctx.fillText('Game Over', parseInt(resolucion[0] / 5) + 5, 
        parseInt(resolucion[1] / 2));
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
    canvas.width = canvas.width;
    canvas.height = canvas.height;
    // ctx.fillStyle = colores.sueloColor;
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
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
	checkComerFruta, checkColision,
	comprobarNivelSuperado, elNivelSuperado,
	nuevaPartida, elGameOver, mostrarMarcadores,
	reescalaCanvas, borraCanvas, laPresentacion,
    nuevaPartidaLocationReload, playSonidos,
    playSonidosLoop, dibuja_scrolls
};

