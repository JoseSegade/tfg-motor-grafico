import Recurso from "./recurso";

/**
 * Almacena los datos de un archivo txt y su contenido como string.
 * */
export default class RecursoObj implements Recurso {
  readonly nombre: string;
    readonly datos: string;

    /**
     * Crea un nuevo obj y lo almacena como recurso.
     * @param nombre Nombre del recurso
     * @param datos Datos como string,
     */
    public constructor(nombre: string, datos: string) {
        this.nombre = nombre;
        this.datos = datos;
    }
}