import Importador from "./importador";
import Importadores from "./importadores";
import RecursoShader from "./recursos/recursoShader";

export default class ImportadorShaders implements Importador {

  /**
  *  Extensiones que soporta el importador
  * */
  public get extensiones(): string[] {
      return ['frag', 'vert'];
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
          const asset = new RecursoShader(assetName, request.responseText);
          Importadores.recursoCargado(asset);
      }
  }
}