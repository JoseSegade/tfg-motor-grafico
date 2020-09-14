import Vector2 from 'core/math/vector2';

export default class Casilla {
  public columna: number = 0;
  public fila: number = 0;
  public static tamanoCasilla = 1;

  public cambiarCasilla(pos: Vector2): Vector2 {
    this.columna = Math.floor(pos.x / Casilla.tamanoCasilla);
    this.fila = Math.floor(pos.y / Casilla.tamanoCasilla);

    return new Vector2(this.columna, this.fila);
  }

  public static obtenerPosicionCentradoCasilla(pos: Vector2): Vector2 {
    return new Vector2(
      Math.floor(pos.x / Casilla.tamanoCasilla) * Casilla.tamanoCasilla,
      Math.floor(pos.y / Casilla.tamanoCasilla) * Casilla.tamanoCasilla,
    );
  }

  public static obtenerPosicion(columna: number, fila: number): Vector2 {
    return new Vector2(
      columna * Casilla.tamanoCasilla,
      fila * Casilla.tamanoCasilla,
    );
  }

  public static obtenerCasilla(pos: Vector2): Vector2 {
    return new Vector2(
      Math.floor(pos.x / Casilla.tamanoCasilla),
      Math.floor(pos.y / Casilla.tamanoCasilla),
    );
  }

  public static obtenerCasillaInversa(pos: Vector2): Vector2 {
    return new Vector2(
      7 - Math.floor(pos.x / Casilla.tamanoCasilla),
      7 - Math.floor(pos.y / Casilla.tamanoCasilla),
    );
  }

  public posicionRatonEnCasilla(pos: Vector2): boolean {
    return (
      this.columna === Math.floor(pos.x / Casilla.tamanoCasilla) &&
      this.fila === Math.floor(pos.y / Casilla.tamanoCasilla)
    );
  }
}
