import Vector2 from "../math/vector2";

/**
 * Representa el valor minimo y maximo de texturas de coordenada. Sirve para almacenar infomacion de una imagen o textura
 * que quiere recortarse.
 * */
export default class UVInfo {
    /**
     * Valor minimo (coord x e y) del uv de la textura.
     * */
    public min: Vector2;

    /**
     * Valor maximo (coord x e y) del uv de la textura.
     * */
    public max: Vector2;

    public constructor(min: Vector2, max: Vector2) {
        this.min = min;
        this.max = max;
    }
}