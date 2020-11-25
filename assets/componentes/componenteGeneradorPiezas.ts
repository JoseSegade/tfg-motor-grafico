import ComponenteBase from '../../motor/logica/componentes/componenteBase';
import Escena from '../../motor/logica/escena/escena';
import ObjetoVirtual from '../../motor/logica/escena/objetoVirtual';
import ComponenteSpriteAnimado from '../../motor/logica/componentes/componentesDefault/componenteSpriteAnimado';
import Transform from '../../motor/fisica/matematicas/transform';
import Casilla from './casilla';
import ComponenteTablero from './componenteTablero';
import ComponenteArrastrarPieza from './componenteArrastrarPieza';
import SuscripcionMensaje from '../../motor/logica/mensajes/suscripcionMensaje';
import Mensaje from '../../motor/logica/mensajes/mensaje';

export default class ComponenteGeneradorPiezas
  extends ComponenteBase
  implements SuscripcionMensaje {
  public jsonPrefab: any;
  public prefabObj: ObjetoVirtual;
  public anchoTablero = 8;
  public altoTablero = 8;
  public anchoFicha = 1;
  public altoFicha = 1;
  public framesFichas: { [key: string]: number } = {};
  private componenteTablero: ComponenteTablero;
  private fichas: ObjetoVirtual[] = [];
  private SELECCIONAR_BLANCAS = 'SELECCIONAR_BLANCAS';
  private SELECCIONAR_NEGRAS = 'SELECCIONAR_NEGRAS';
  private instanciado = false;

  public cargarConfiguracion(): void {
    this.prefabObj = Escena.cargarObjetoVirtual(this.jsonPrefab, undefined);
    Casilla.tamanoCasilla = Math.max(this.anchoFicha, this.altoFicha);
    this.componenteTablero = this.objetoVirtual.obtenerComponente(
      'componenteTablero',
    ) as ComponenteTablero;
    Mensaje.suscribirse(this.SELECCIONAR_BLANCAS, this);
    Mensaje.suscribirse(this.SELECCIONAR_NEGRAS, this);
    Mensaje.enviar(this.SELECCIONAR_BLANCAS, this, undefined);
    super.cargarConfiguracion();
  }

  public recibirMensaje(mensaje: Mensaje): void {
      if(mensaje.codigo === this.SELECCIONAR_BLANCAS){
          this.componenteTablero.humanAsWhite = 1;
          this.instanciarFichas();
          this.instanciado = true;
        }
        if(mensaje.codigo === this.SELECCIONAR_NEGRAS) {
            this.componenteTablero.humanAsWhite = 0;
            this.componenteTablero.primerMovimiento();
          this.instanciarFichas();
          this.componenteTablero.printTablero();
          this.instanciado = true;
      }
  }

  private instanciarFichas(): void {
      if(this.instanciado) {
        return;
      }
    this.componenteTablero.chessBoard.forEach((fila, filaIdx) =>
      fila.forEach((valor, columnaIdx) => {
        if (valor !== ' ') {
            const v: string = this.componenteTablero.humanAsWhite === 1 ? valor : this.obtenerValorInverso(valor);
          const objetoInstancia: ObjetoVirtual = Escena.cargarObjetoVirtual(
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
          // (objetoInstancia.obtenerComponente(
          //   'comportamientoArrastrar',
          // ) as ComponenteArrastrarPieza).componenteTablero = this.componenteTablero;
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
