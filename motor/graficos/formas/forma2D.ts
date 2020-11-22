import Vector2 from "../../fisica/matematicas/vector2";

/**
 * Interfaz para todas las formas 2D
 * */
export default interface Forma2D {

    /**
     * Posicion de la forma. Coordenadas x e y.
     * */
    posicion: Vector2;

    /**
     * Origen de la forma. Coordenadas x e y.
     * */
    origen: Vector2;

    readonly offset: Vector2;

    /**
     * Devuelve true si la otra forma y esta se solapan.
     * @param otro Forma2d con la que se comprobara si se solapan.
     */
    intersecciona(otro: Forma2D): boolean;
}