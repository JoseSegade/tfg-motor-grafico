import Vector2 from '../math/vector2';

/**
 * Indica el estado actual del raton.
 * */
export default class DatosRaton {
    /**
     * True si el boton izquierdo del raton esta pulsado
     * */
    public readonly btnIzquierdo: boolean;

    /**
     * True si el boton derecho del raton esta pulsado
     * */
    public readonly btnDerecho: boolean;

    /**
     * Posicion del cursor
     * */
    public readonly posicion: Vector2;

    public constructor(btnIzquierdo: boolean, btnDerecho: boolean, posicion: Vector2) {
        this.btnIzquierdo = btnIzquierdo;
        this.btnDerecho = btnDerecho;
        this.posicion = posicion;
    }
}