import Importador from './importador';
import Importadores from './importadores';
import RecursoObj from './recursos/recursoObj';

export default class ImportadorObj implements Importador {
  /**
   *  Extensiones que soporta el importador
   * */
  public get extensiones(): string[] {
    return ['obj'];
  }

  /**
   * Crea y carga un recurso en memoria.
   * @param nombre Nombre del recurso.
   */
  public cargarRecurso(assetName: string): void {
    const request = new XMLHttpRequest();
    request.open('GET', `/obj/${assetName}`);
    request.addEventListener('load', this.onTextLoaded.bind(this, assetName, request));
    request.send();
  }

  public onTextLoaded(assetName: string, request: XMLHttpRequest): void {
    if (request.readyState === request.DONE) {
      const asset = new RecursoObj(assetName, request.responseText);
      Importadores.recursoCargado(asset);
    }
  }
}
