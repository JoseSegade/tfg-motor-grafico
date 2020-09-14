import FuncionalidadBase from 'core/funcionalidades/funcionalidadBase';
import Nivel from 'core/mundo/nivel';
import ObjetoVirtual from 'core/mundo/ObjetoVirtual';
import ComponenteSpriteAnimado from 'core/componentes/componentesDefault/componenteSpriteAnimado';
import Transform from 'core/math/transform';
import Casilla from './casilla';
import FuncionalidadTablero from './funcionalidadTablero';
import FuncionalidadArrastrarPieza from './funcionalidadArrastrarPieza';
import SuscripcionMensaje from 'core/mensajes/SuscripcionMensaje';
import Mensaje from 'core/mensajes/Mensaje';

export default class FuncionalidadGeneradorPiezas
  extends FuncionalidadBase
  implements SuscripcionMensaje {
  public jsonPrefab: any;
  public prefabObj: ObjetoVirtual;
  public anchoTablero: number = 8;
  public altoTablero: number = 8;
  public anchoFicha: number = 1;
  public altoFicha: number = 1;
  public framesFichas: { [key: string]: number } = {};
  private funcionalidadTablero: FuncionalidadTablero;
  private fichas: ObjetoVirtual[] = [];
  private SELECCIONAR_BLANCAS = 'SELECCIONAR_BLANCAS';
  private SELECCIONAR_NEGRAS = 'SELECCIONAR_NEGRAS';
  private instanciado: boolean = false;

  public cargarConfiguracion(): void {
    this.prefabObj = Nivel.cargarObjetoVirtual(this.jsonPrefab, undefined);
    Casilla.tamanoCasilla = Math.max(this.anchoFicha, this.altoFicha);
    this.funcionalidadTablero = this.objetoVirtual.obtenerFuncionalidad(
      'funcionalidadTablero',
    ) as FuncionalidadTablero;
    Mensaje.suscribirse(this.SELECCIONAR_BLANCAS, this);
    Mensaje.suscribirse(this.SELECCIONAR_NEGRAS, this);
    super.cargarConfiguracion();
  }

  public recibirMensaje(mensaje: Mensaje): void {
      console.log(mensaje);
      if(mensaje.codigo === this.SELECCIONAR_BLANCAS){
          this.funcionalidadTablero.humanAsWhite = 1;
          this.instanciarFichas();
          this.instanciado = true;
        }
        if(mensaje.codigo === this.SELECCIONAR_NEGRAS) {
            this.funcionalidadTablero.humanAsWhite = 0;
            this.funcionalidadTablero.primerMovimiento();
          this.instanciarFichas();
          this.funcionalidadTablero.printTablero();
          this.instanciado = true;
      }
  }

  public activar(): void {
  }

  private instanciarFichas(): void {
      if(this.instanciado) {
        return;
      }
    this.funcionalidadTablero.chessBoard.forEach((fila, filaIdx) =>
      fila.forEach((valor, columnaIdx) => {
        if (valor !== ' ') {
            const v: string = this.funcionalidadTablero.humanAsWhite === 1 ? valor : this.obtenerValorInverso(valor);
          const objetoInstancia: ObjetoVirtual = Nivel.cargarObjetoVirtual(
            this.jsonPrefab,
            this.objetoVirtual,
          );
          objetoInstancia.transform = new Transform();
          objetoInstancia.transform.position.set(
            columnaIdx * this.anchoFicha,
            filaIdx * this.altoFicha,
          );
          (objetoInstancia.obtenerComponente(
            'fichasSprite',
          ) as ComponenteSpriteAnimado).offset = this.framesFichas[v];
          (objetoInstancia.obtenerFuncionalidad(
            'comportamientoArrastrar',
          ) as FuncionalidadArrastrarPieza).funcionalidadTablero = this.funcionalidadTablero;
          objetoInstancia.cargarConfiguracion();
          this.fichas.push(objetoInstancia);
        }
      }),
    );
    this.instanciado = true;
  }

  private obtenerValorInverso(valor: string): string {
    if(valor === valor.toUpperCase()) {
        return valor.toLowerCase();
    }
    else {
        return valor.toUpperCase();
    }
  }
}
