import Forma2D from "./Forma2D";
import Vector2 from "../../math/vector2";
import { Rectangulo2D } from "./Rectangulo2D";

/**
 * Circulo en 2D util para las colisiones.
 * */
export default class Circulo2D implements Forma2D {

    /**
     * Posicion en la que se encuentra el circulo.
     * */
    public posicion: Vector2 = Vector2.zero;

    /**
     * Origen sobre el centro de coordenadas del circulo.
     * */
    public origen: Vector2 = Vector2.zero;

    /**
     * Radio del circulo
     * */
    public radio: number;

    /**
     * Offset del circulo con respecto al centro de coordenadas.
     * */
    public get offset(): Vector2 {
        return new Vector2(this.radio + (this.radio * this.origen.x), this.radio + (this.radio * this.origen.y));
    }

    /**
     * Carga los datos desde un json.
     * @param json Json desde el que se obtienen los datos.
     */
    public configurarDesdeJson(json: any): void {
        if (json.posicion !== undefined) {
            this.posicion.setFromJson(json.posicion);
        }

        if (json.origin !== undefined) {
            this.posicion.setFromJson(json.posicion);
        }

        if (json.radio === undefined) {
            throw new Error("Circle2D requires radio to be present.");
        }
        this.radio = Number(json.radio);
    }

    /**
     * Devuelve true en caso de interseccionar con otra forma 2D.
     * @param otro Forma 2D con la que se quiere comparar las posiciones.
     */
    public intersecciona(otro: Forma2D): boolean {
        if (otro instanceof Circulo2D) {
            if (Vector2.distance(otro.posicion, this.posicion) <= this.radio + otro.radio) {
                return true;
            }
        }

        if (otro instanceof Rectangulo2D) {
            const xDiff = this.posicion.x - Math.max(otro.posicion.x, Math.min(this.posicion.x, otro.posicion.x + otro.ancho));
            const yDiff = this.posicion.y - Math.max(otro.posicion.y, Math.min(this.posicion.y, otro.posicion.y + otro.alto));
            if ((xDiff * xDiff + yDiff * yDiff) < (this.radio * this.radio)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Devuelve true si el punto seleccionado esta dentro del circulo.
     * @param point Punto con el que se quiere comparar.
     */
    public estaDentro(punto: Vector2): boolean {
        if (Vector2.distance(this.posicion, punto) <= this.radio) {
            return true;
        }
        return false;
    }

}