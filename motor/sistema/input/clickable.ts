import DatosRaton from "./datosRaton";

/**
 * Determina un elemento como clickable para que pueda recibir datos de raton.
 */
export default interface Clickable {

  /**
   * Notifica al elemento clickable con los datos de raton.
   * @param codigo Codigo del click (pulsar, soltar, mantener).
   * @param datos Datos del raton.
   */
  notificar(codigo: string, datos:DatosRaton);
}