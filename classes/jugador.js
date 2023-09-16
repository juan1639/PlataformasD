import { 
    constante,
    ctx,
    scroll,
    estado
} from "../constants.js";

import { checkColision } from "../functions.js";

export class Jugador {
    constructor(left, top) {

        this.ssheet = new Image();
        this.ssheet.src = '../img/Ssheet_jugador.png';

        this.plataformaMETA = -999;

        this.rect = {
            x: left,
            y: top,
            ancho: 100,
            alto: constante.jug_alto,
            clipX: 0,
            clipY: 0,
            clipAncho: 27,
            clipAlto: 27
        }

        this.move = {
            acelX: 0.0,
            velX: 7,
            velY: -20,
            flip: false
        }
    }

    actualiza() {

        // -------------------------------------------------
        //  RESETs (scroll, dx, dy)
        // -------------------------------------------------
        scroll.scroll = 0;
        let dx = 0;
        let dy = 0;

        // dx = this.leer_teclado(dx);

        this.move.velY += constante.gravedad;
        dy += this.move.velY;

        // dx = check_limitesHor(dx);
        dy = this.check_colisionPlataformas(dy);
        // dy = check_caerAlVacio(dy);
        // check_colision_plataformaMeta();
        // scroll.scroll = check_scrollThresh(scroll.scroll, dy);

        this.rect.x += dx;
        this.rect.y += dy + scroll.scroll;

        if (this.move.acelX > 0) this.move.acelX --;

        return scroll.scroll;
    }

    dibuja() {
        ctx.drawImage(this.ssheet, 0, 0, this.rect.clipAncho, this.rect.clipAlto, 
            this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
    }

    check_colisionPlataformas(dy) {
        for (let plataf of estado.plataformas_visibles) {
            if (checkColision(plataf, this, 0, dy)) {
                if (this.rect.y + this.rect.alto < plataf.rect.y + Math.floor(plataf.rect.alto / 2)) {
                    if (this.move.velY > 0) {
                        this.rect.y = plataf.rect.y - this.rect.alto;
                        dy = 0;
                        this.move.velY = -20;
                    }
                }
            }
        }

        return dy;
    }

    leer_teclado(dx) {

    }
}


