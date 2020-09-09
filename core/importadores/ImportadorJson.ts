import Importador from "./Importador";
import RecursoJson from "./recursos/RecursoJson";
import Importadores from "./Importadores";

/**
 * Importador de json.
 * */
export default class ImportadorJson implements Importador {

    /**
    *  Extensiones que soporta el importador
    * */
    public get extensiones(): string[] {
        return ['json'];
    }

    /**
     * Crea y carga un recurso en memoria.
     * @param nombre Nombre del recurso.
     */
    public cargarRecurso(nombre: string): void {
        const request: XMLHttpRequest = new XMLHttpRequest();
        request.open('GET', nombre);
        request.addEventListener('load', this.jsonCargado.bind(this, nombre, request));
        request.send();
    }

    private jsonCargado(nombre: string, request: XMLHttpRequest, _: ProgressEvent): void {
        if (request.readyState === request.DONE) {
            const recurso: RecursoJson = new RecursoJson(nombre, request.responseText);
            Importadores.recursoCargado(recurso);
        }
    }

}