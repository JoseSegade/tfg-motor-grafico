import Forma2D from "./forma2D";
import Circulo2D from "./circulo2D";
import Vector2 from "../../fisica/matematicas/vector2";

/**
 * Rectangulo en 2D util para las colisiones.
 * */
export class Rectangulo2D implements Forma2D {
    /**
     * Posicion en el espacio.
     */
    public posicion: Vector2 = Vector2.zero;

    /**
     * Origen con respecto a su posicion.
     */
    public origen: Vector2 = Vector2.zero;

    /**
     * Ancho del rectangulo.
     */
    public ancho: number;

    /**
     * Alto del rectangulo.
     */
    public alto: number;

    /**
     * Crea un nuevo rectangulo.
     * @param x Coordenada de las x.
     * @param y Coordenada de las y.
     * @param ancho Ancho del rectangulo.
     * @param alto Alto del rectangulo.
     */
    public constructor(x: number = 0, y: number = 0, ancho: number = 0, alto: number = 0) {
        this.posicion.x = x;
        this.posicion.y = y;
        this.ancho = ancho;
        this.alto = alto;
    }

    /**
     * Desfase del rectangulo respecto al origen.
     * */
    public get offset(): Vector2 {
        return new Vector2((this.ancho * this.origen.x), (this.alto * this.origen.y));
    }

    /**
     * Devuelve true en caso de interseccionar con otra forma 2D.
     * @param otro Forma 2D con la que se quiere comparar las posiciones.
     */
    public intersecciona(other: Forma2D): boolean {
        if (other instanceof Rectangulo2D) {
            const a: Rectangulo2D = this.obtenerLaterales(this);
            const b: Rectangulo2D = this.obtenerLaterales(other);

            return ((a.posicion.x <= b.ancho && a.ancho >= b.posicion.x) && (a.posicion.y <= b.alto && a.alto >= b.posicion.y));
        }

        if (other instanceof Circulo2D) {
            const xDiff = other.posicion.x - Math.max(this.posicion.x, Math.min(other.posicion.x, this.posicion.x + this.ancho));
            const yDiff = other.posicion.y - Math.max(this.posicion.y, Math.min(other.posicion.y, this.posicion.y + this.alto));
            if ((xDiff * xDiff + yDiff * yDiff) < (other.radio * other.radio)) {
                return true;
            }
        }
        return false;
    }

    private obtenerLaterales(forma: Rectangulo2D): Rectangulo2D {
        const x = forma.ancho < 0 ? forma.posicion.x - forma.ancho : forma.posicion.x;
        const y = forma.alto < 0 ? forma.posicion.y - forma.alto : forma.posicion.y;

        const extentX = forma.ancho < 0 ? forma.posicion.x : forma.posicion.x + forma.ancho;
        const extentY = forma.alto < 0 ? forma.posicion.y : forma.posicion.y + forma.alto;

        return new Rectangulo2D(x, y, extentX, extentY);
    }
}
