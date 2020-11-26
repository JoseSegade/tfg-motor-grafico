import Clickable from "./clickable";
import DatosRaton from "./datosRaton";

export default class Input {
  private static _suscriptores: Clickable[] = [];
  private static _infoRaton: DatosRaton;

  /**
   * Ultima informacion de raton registrada.
   */
  public static get infoRaton(): DatosRaton {
    return Input._infoRaton;
  }

  /**
   * Ultima informacion de raton registrada.
   */
  public static set infoRaton(datos: DatosRaton) {
    Input._infoRaton = datos;
  } 

  /**
   * Suscribe un objeto para recibir datos de click.
   * @param clickable Objeto clickable.
   */
  public static suscribirse(clickable: Clickable) {
    if(!Input._suscriptores.includes(clickable)) {
      Input._suscriptores.push(clickable);
    }
  }

  /**
   * Notifica al suscriptor de que ha modificado el input.
   * @param codigo Codigo de click.
   * @param datos Datos de raton.
   */
  public static notificar(codigo: string, datos: DatosRaton): void  {
    Input._infoRaton = datos;
    Input._suscriptores.forEach(suscriptor => {
      suscriptor.notificar(codigo, datos);
    });
  }

}