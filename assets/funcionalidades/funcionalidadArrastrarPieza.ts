import FuncionalidadArrastrarConClick from 'core/funcionalidades/funcionalidadesDefault/funcionadadArrastrarConClick';
import Pieza, { TIPO_PIEZA } from './pieza';
import Vector3 from 'core/math/vector3';

export default class FuncionalidadArrastrarPieza extends FuncionalidadArrastrarConClick implements Pieza {
  public tipoPieza: TIPO_PIEZA;
  public posicionInicial: Vector3 = Vector3.zero;
  
  public puedeMoverse(): boolean {
    throw new Error("Method not implemented.");
  }

  public puedeMoverseHacia(): boolean {
    return false;
  }

  public cargarConfiguracion(): void {
    super.cargarConfiguracion();
  }

  public alMoverRaton(): void {
    this.objetoVirtual.transform.position.set(this.posRaton.x, this.posRaton.y);
  }

  public alEmpezarClick(): void {
    this.posicionInicial.copyFrom(this.objetoVirtual.transform.position);
    this.objetoVirtual.transform.position.set(this.posRaton.x, this.posRaton.y);
  }


  public alSoltarClick(): void {
    this.objetoVirtual.transform.position.set(this.posRaton.x, this.posRaton.y);
    if(!this.puedeMoverseHacia()) {
      console.log(this.posicionInicial);
      this.objetoVirtual.transform.position.copyFrom(this.posicionInicial);
    }
  }
}
