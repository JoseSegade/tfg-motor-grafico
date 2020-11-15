import Recurso from "./recurso";

/**
 * Almacena los datos de una imagen en memoria.
 * */
export default class RecursoImagen implements Recurso {

    readonly nombre: string;
    readonly datos: HTMLImageElement;

    /**
     * Crea una nueva imagen y la almacena como recurso.
     * @param nombre Nombre del recurso.
     * @param datos Datos del recurso.
     */
    public constructor(nombre: string, datos: HTMLImageElement) {
        this.nombre = nombre;
        this.datos = datos;
    }

    /** 
     *  Ancho del elemento imagen. 
     * */
    public get ancho(): number {
        return this.datos.width;
    }

    /** 
     *  Alto del elemento imagen. 
     * */
    public get alto(): number {
        return this.datos.height;
    }
}