import { 
    constante,
    ctx,
    scroll,
    estado,
    jugadorImg
} from "../constants.js";

import { checkColision } from "../functions.js";

export class Jugador {
    constructor(left, top) {

        jugadorImg.ssheet.src = '../img/Ssheet_jugador.png';
        jugadorImg.ssheet.onload = () => {
            this.ssheet = jugadorImg.ssheet;
        }

        this.plataformaMETA = -999;

        this.rect = {
            x: left,
            y: top,
            ancho: 80,
            alto: constante.jug_alto,
            clipX: 0,
            clipY: 0,
            clipAncho: 80,
            clipAlto: 110
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
        if (this.move.velY > 0 && this.move.velY < 2) {
            ctx.drawImage(this.ssheet, 240, 0, this.rect.clipAncho, this.rect.clipAlto, 
                this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);

        } else if (this.move.velY > 0) {
            ctx.drawImage(this.ssheet, 160, 0, this.rect.clipAncho, this.rect.clipAlto, 
                this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);

        } else if (this.move.velY <= 0 && this.move.velY > -2) {
            ctx.drawImage(this.ssheet, 0, 0, this.rect.clipAncho, this.rect.clipAlto, 
                this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);

        } else {
            ctx.drawImage(this.ssheet, 80, 0, this.rect.clipAncho, this.rect.clipAlto, 
                this.rect.x, this.rect.y, this.rect.ancho, this.rect.alto);
        } 
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


