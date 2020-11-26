import ComponenteBase from '../../motor/logica/componentes/componenteBase';
import Escena from '../../motor/logica/escena/escena';
import ObjetoVirtual from '../../motor/logica/escena/objetoVirtual';
import Transform from '../../motor/fisica/matematicas/transform';
import Casilla from './casilla';
import ComponenteTablero from './componenteTablero';
import ComponenteArrastrarPieza from './componenteArrastrarPieza';
import SuscripcionMensaje from '../../motor/logica/mensajes/suscripcionMensaje';
import Mensaje from '../../motor/logica/mensajes/mensaje';
import Vector3 from 'motor/fisica/matematicas/vector3';
import ComponenteMesh from 'motor/logica/componentes/componentesDefault/componenteMesh';

export default class ComponenteInstanciadorPiezas
  extends ComponenteBase
  implements SuscripcionMensaje {
  public tamanoCasillaX: number;
  public tamanoCasillaY: number;
  public equivalenciaObj: { [key: string]: string } = {};
  public nombresTex: { [key: string]: string } = {};
  private componenteTablero: ComponenteTablero;
  private fichas: ObjetoVirtual[] = [];
  private SELECCIONAR_BLANCAS = 'SELECCIONAR_BLANCAS';
  private SELECCIONAR_NEGRAS = 'SELECCIONAR_NEGRAS';
  private instanciado = false;

  public cargarConfiguracion(): void {
    Casilla.tamanoCasilla = Math.max(this.tamanoCasillaX, this.tamanoCasillaY);
    this.componenteTablero = this.objetoVirtual.obtenerComponente(
      'componenteTablero',
    ) as ComponenteTablero;
    Mensaje.suscribirse(this.SELECCIONAR_BLANCAS, this);
    Mensaje.suscribirse(this.SELECCIONAR_NEGRAS, this);
    Mensaje.enviar(this.SELECCIONAR_BLANCAS, this, undefined);
    super.cargarConfiguracion();
  }

  public recibirMensaje(mensaje: Mensaje): void {
    if (mensaje.codigo === this.SELECCIONAR_BLANCAS) {
      this.componenteTablero.humanAsWhite = 1;
      this.instanciarFichas();
      this.instanciado = true;
    }
    if (mensaje.codigo === this.SELECCIONAR_NEGRAS) {
      this.componenteTablero.humanAsWhite = 0;
      this.componenteTablero.primerMovimiento();
      this.instanciarFichas();
      this.componenteTablero.printTablero();
      this.instanciado = true;
    }
  }

  private instanciarFichas(): void {
    if (this.instanciado) {
      return;
    }
    this.componenteTablero.chessBoard.forEach((fila, filaIdx) =>
      fila.forEach((valor, columnaIdx) => {
        if (valor !== ' ') {
          const v: string =
            this.componenteTablero.humanAsWhite === 1 ? valor : this.obtenerValorInverso(valor);
          const nombre = valor;
          const nombreMaterial = this.nombresTex[valor];

          if (nombreMaterial === undefined) {
            console.warn(
              `No se ha cargado una configuración adecuada para
               la ficha ${valor}, por favor, indique un material.`,
            );
            return;
          }

          const nombreObj = this.equivalenciaObj[valor.toUpperCase()];

          if (nombreObj === undefined) {
            console.warn(
              `No se ha cargado una configuración adecuada para la 
              ficha ${valor}, por favor, suba un archivo obj en la carpeta /public/obj/ con el
              nombre correspondiente, e indíquelo en el archivo de configuración.`
            );
            return;
          }

          const objetoInstancia: ObjetoVirtual = Escena.cargarObjetoVirtual({nombre, nombreMaterial}, this.objetoVirtual);
          objetoInstancia.transform = new Transform();
          if(this.tamanoCasillaX === undefined){
            this.tamanoCasillaX = 0;
          }

          if(this.tamanoCasillaY === undefined){
            this.tamanoCasillaY = 0;
          }
          objetoInstancia.transform.position.set(
            columnaIdx * this.tamanoCasillaX - (this.tamanoCasillaX * 4) + this.tamanoCasillaX / 2,
            0,
            filaIdx * this.tamanoCasillaY - (this.tamanoCasillaY*4) + this.tamanoCasillaY / 2
          );
          const mesh = new ComponenteMesh();
          mesh.nombre = `${nombreObj}__mesh`;
          mesh.nombreMalla = nombreObj;
          objetoInstancia.agregarComponente(mesh);
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
    if (valor === valor.toUpperCase()) {
      return valor.toLowerCase();
    } else {
      return valor.toUpperCase();
    }
  }
}
