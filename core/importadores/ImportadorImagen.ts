import Importador from "./Importador";
import Importadores from "./Importadores";
import RecursoImagen from "./recursos/RecursoImagen"

/**
 * Importador de imagenes.
 * */
export default class ImportadorImagen implements Importador {

    /** 
     *  Extensiones que soporta el importador
     * */
    public get extensiones(): string[] {
        return ['png', 'gif', 'jpg'];
    }

    /**
     * Crea y carga un recurso en memoria.
     * @param nombre Nombre del recurso.
     */
    public cargarRecurso(nombre: string): void {
        const imagen: HTMLImageElement = new Image();
        imagen.onload = this.imagenCargada.bind(this, nombre, imagen);
        imagen.src = nombre;
    }

    private imagenCargada(nombre: string, imagen: HTMLImageElement): void {
        const recurso: RecursoImagen = new RecursoImagen(nombre, imagen);
        Importadores.recursoCargado(recurso);
    }

}