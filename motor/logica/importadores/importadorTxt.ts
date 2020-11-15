import Importador from "./importador";
import RecursoTexto from "./recursos/recursoTexto";
import Importadores from "./importadores";

/**
 * Importador de txt.
 * */
export default class ImportadorTxt implements Importador {

    /**
    *  Extensiones que soporta el importador
    * */
    public get extensiones(): string[] {
        return ["txt"];
    }

    /**
     * Crea y carga un recurso en memoria.
     * @param nombre Nombre del recurso.
     */
    public cargarRecurso(assetName: string): void {
        const request = new XMLHttpRequest();
        request.open('GET', assetName);
        request.addEventListener('load', this.onTextLoaded.bind(this, assetName, request));
        request.send();
    }

    public onTextLoaded(assetName: string, request: XMLHttpRequest): void {
        if (request.readyState === request.DONE) {
            const asset = new RecursoTexto(assetName, request.responseText);
            Importadores.recursoCargado(asset);
        }
    }
}