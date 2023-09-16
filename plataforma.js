import { 
    constante,
    ctx,
    scroll,
    estado,
    plataformasImg
} from "./constants.js";

export class Plataforma {
    constructor(x, y, ancho, velX_rnd, tx, ty) {

        this.x = x * tx;
        this.y = y * ty;

        this.tx = tx;
        this.ty = ty;

        plataformasImg.medio.src = './img/tile1.png';
        plataformasImg.izq.src = './img/tile2.png';
        plataformasImg.dcha.src = './img/tile3.png';
        plataformasImg.izqS.src = './img/tile4.png';
        plataformasImg.dchaS.src = './img/tile5.png';
        plataformasImg.movil.src = './img/tile6.png';

        this.arrayPlataf = [];

        if (velX_rnd === 0) {
            for (let segm = 0; segm < ancho; segm ++) {
                if (segm === 0 && ancho < columnas) {
                    this.arrayPlataf.push(plataformasImg.izq);
                    
                } else if (segm === ancho -1 && ancho < columnas) {
                    this.arrayPlataf.push(plataformasImg.dcha);
                    
                } else {
                    this.arrayPlataf.push(plataformasImg.medio);
                }
            } 

        } else {
            for (let i = 0; i < ancho; i ++) {
                this.arrayPlataf.push(plataformasImg.movil);
            }
        }

        this.rect = {
            x: this.x,
            y: this.y,
            ancho: ancho,
            velX: velX_rnd
        }

        console.log(this.rect.x, this.rect.y);
    }

    actualiza() {
        this.rect.y += scroll.scroll + 1;
        this.rect.x += this.rect.velX;

        if ((this.rect.x + this.rect.ancho * constante.bsx > constante.resolucion[0] && this.rect.velX > 0) ||
            (this.rect.x < 0 && this.rect.velX < 0)) {
                this.rect.velX *= -1;
            } 

        if (this.rect.y > constante.resolucion[1]) {
            estado.plataformas_visibles.shift(); 
        }
    }

    dibuja() {
        this.actualiza();

        for (let i = 0; i < this.arrayPlataf.length; i ++) {
            const segmento = this.arrayPlataf[i];
            ctx.drawImage(segmento, this.rect.x + i * this.tx, 
                this.rect.y, this.tx, this.ty);
        }
    }
}

