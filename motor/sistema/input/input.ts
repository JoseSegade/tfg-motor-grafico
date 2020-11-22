import Clickable from "./clickable";
import DatosRaton from "./datosRaton";

export default class Input {
  private static _suscriptores: Clickable[] = [];
  private static _infoRaton: DatosRaton;

  /**
   * Ultima informacion de raton registrada.
   */
  public static get infoRaton(): DatosRaton {
    return this._infoRaton;
  }

  /**
   * Ultima informacion de raton registrada.
   */
  public static set infoRaton(datos: DatosRaton) {
    this._infoRaton = datos;
  } 

  /**
   * Suscribe un objeto para recibir datos de click.
   * @param clickable Objeto clickable.
   */
  public static suscribirse(clickable: Clickable) {
    if(!this._suscriptores.includes(clickable)) {
      this._suscriptores.push(clickable);
    }
  }

  /**
   * Notifica al suscriptor de que ha modificado el input.
   * @param codigo Codigo de click.
   * @param datos Datos de raton.
   */
  public static notificar(codigo: string, datos: DatosRaton): void  {
    this._infoRaton = datos;
    this._suscriptores.forEach(suscriptor => {
      suscriptor.notificar(codigo, datos);
    });
  }

}