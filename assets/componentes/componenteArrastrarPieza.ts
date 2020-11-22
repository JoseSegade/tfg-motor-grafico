import ComponenteArrastrarConClick from '../../motor/logica/componentes/componentesDefault/componenteClickable';
import Vector3 from '../../motor/fisica/matematicas/vector3';
import Casilla from './casilla';
import ComponenteTablero from './componenteTablero';
import Vector2 from '../../motor/fisica/matematicas/vector2';
import Mensaje from '../../motor/logica/mensajes/mensaje';

interface Jugada {
  jugada: string;
  ficha: ComponenteArrastrarPieza;
}

export default class ComponenteArrastrarPieza extends ComponenteArrastrarConClick {
  public posicionInicial: Vector3 = Vector3.zero;
  public casillaActual: Casilla;
  public componenteTablero: ComponenteTablero;
  private arrastrandose = false;
  private haMuerto = false;

  private MOVER_JUGADOR = 'MoverJugador';
  private MOVER_RIVAL = 'MoverRival';

  public puedeMoverseHacia(pos: Vector2): boolean {
    let dragMove: string;
    const casillaInicial = this.componenteTablero.humanAsWhite ? Casilla.obtenerCasillaInversa(this.posicionInicial.xy) : Casilla.obtenerCasilla(this.posicionInicial.xy);
    const casillaFinal = this.componenteTablero.humanAsWhite ? Casilla.obtenerCasillaInversa(pos) : Casilla.obtenerCasilla(pos);
    if (
      casillaFinal.y === 0 &&
      casillaInicial.y == 1 &&
      'P' === this.componenteTablero.chessBoard[casillaInicial.y][casillaFinal.x]
    ) {
      //pawn promotion
      dragMove =
        '' +
        casillaInicial.x +
        casillaFinal.y +
        this.componenteTablero.chessBoard[casillaFinal.y][casillaFinal.x] +
        'QP';
    } else {
      //regular move
      dragMove =
        '' +
        casillaInicial.y +
        casillaInicial.x +
        casillaFinal.y +
        casillaFinal.x +
        this.componenteTablero.chessBoard[casillaFinal.y][casillaFinal.x];
    }
    const userPosibilities: string = this.componenteTablero.posibleMoves();
    if (userPosibilities.replace(dragMove, '').length < userPosibilities.length) {
      this.componenteTablero.makeMove(dragMove);
      Mensaje.enviar(this.MOVER_JUGADOR, this, {jugada: dragMove.trim(), ficha: this});
      this.componenteTablero.flipBoard();
      this.componenteTablero.printTablero();
      const jugada: string = this.componenteTablero.alphaBeta(
        ComponenteTablero.globalDepth,
        1000000,
        -1000000,
        '',
        0,
      );
      console.log(jugada);
      this.componenteTablero.makeMove(jugada);
      this.componenteTablero.flipBoard();
      this.componenteTablero.printTablero();
      Mensaje.enviar(this.MOVER_RIVAL, this, {jugada: jugada.trim(), ficha: this});
      return true;
    }

    return false;
  }

  public recibirMensaje(mensaje: Mensaje): void {
    if (this.haMuerto) {
      return;
    }
    if (mensaje.codigo === this.MOVER_RIVAL) {
      const { jugada } =  (mensaje.contexto as Jugada);
      if (
        this.casillaActual.fila === 7 - Number(jugada.charAt(0)) &&
        this.casillaActual.columna === 7 - Number(jugada.charAt(1))
      ) {
        const pos = Casilla.obtenerPosicion(
          7 - Number(jugada.charAt(3)),
          7 - Number(jugada.charAt(2)),
        );
        this.objetoVirtual.transform.position.set(pos.x, pos.y);
        this.casillaActual.cambiarCasilla(this.objetoVirtual.transform.position.xy);
      } else if (
        this.casillaActual.fila === 7 - Number(jugada.charAt(2)) &&
        this.casillaActual.columna === 7 - Number(jugada.charAt(3))
      ) {
        this.objetoVirtual.objetoPadre.eliminarObjetoHijo(this.objetoVirtual);
        this.haMuerto = true;
      }
    }
    if (mensaje.codigo === this.MOVER_JUGADOR) {
      const ultimaJugada = (mensaje.contexto as Jugada);
      if(ultimaJugada.ficha === this) {
        return;
      }
      const { jugada } = ultimaJugada;
      if (
        this.casillaActual.fila === Number(jugada.charAt(2)) &&
        this.casillaActual.columna === Number(jugada.charAt(3))
        ) {
        const obP = this.objetoVirtual.objetoPadre;
        obP.eliminarObjetoHijo(this.objetoVirtual);
        this.haMuerto = true;
      }
    }
  }

  public cargarConfiguracion(): void {
    super.cargarConfiguracion();
    this.haMuerto = false;
    Mensaje.suscribirse(this.MOVER_JUGADOR, this);
    Mensaje.suscribirse(this.MOVER_RIVAL, this);
    this.casillaActual = new Casilla();
    this.casillaActual.cambiarCasilla(this.objetoVirtual.transform.position.xy);
  }

  public alMoverRaton(): void {
    if (!this.haMuerto && this.arrastrandose) {
      const nuevaPos = Casilla.obtenerPosicionCentradoCasilla(this.posRaton);
      this.objetoVirtual.transform.position.set(nuevaPos.x, nuevaPos.y);
    }
  }

  public alEmpezarClick(): void {
    if (!this.haMuerto && this.casillaActual.posicionRatonEnCasilla(this.posRaton)) {
      this.posicionInicial.copyFrom(this.objetoVirtual.transform.position);
      const objPadre = this.objetoVirtual.objetoPadre;
      objPadre.eliminarObjetoHijo(this.objetoVirtual);
      objPadre.anadirObjetoHijo(this.objetoVirtual);
      this.arrastrandose = true;
    }
  }

  public alSoltarClick(): void {
    if (!this.haMuerto && this.arrastrandose) {
      this.arrastrandose = false;
      const nuevaPos = Casilla.obtenerPosicionCentradoCasilla(this.posRaton);
      this.objetoVirtual.transform.position.set(nuevaPos.x, nuevaPos.y);
      if (!this.puedeMoverseHacia(nuevaPos)) {
        this.objetoVirtual.transform.position.copyFrom(this.posicionInicial);
      }
      this.casillaActual.cambiarCasilla(this.objetoVirtual.transform.position.xy);
    }
  }
}
