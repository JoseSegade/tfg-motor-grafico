import Recurso from "./recurso";


/**
 * Almacena los datos de un archivo json en memoria.
 * */
export default class RecursoJson implements Recurso {
    readonly nombre: string;
    readonly datos: any;

    /**
     * Crea una nuevo json y lo almacena como recurso.
     * @param nombre Nombre del recurso.
     * @param datos Datos del recurso.
     */
    public constructor(nombre: string, json: string) {
        this.nombre = nombre;
        this.datos = JSON.parse(json);
    }
}