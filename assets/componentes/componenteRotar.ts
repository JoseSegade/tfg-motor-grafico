import ConstantesMensajeria from "motor/constantes/constantesMensajeria";
import Vector2 from "motor/fisica/matematicas/vector2";
import Vector3 from "motor/fisica/matematicas/vector3";
import ComponenteBase from "motor/logica/componentes/componenteBase";
import Clickable from "motor/sistema/input/clickable";
import DatosRaton from "motor/sistema/input/datosRaton";
import Input from "motor/sistema/input/input";

export default class ComponenteRotar extends ComponenteBase implements Clickable {
  private ultimaPos = Vector2.zero;
  private posPantalla = Vector2.zero;
  private pulsa = false;
  private delta = 0;
  private anguloZoom = Vector3.zero;
  private vel = 2;
  private veces = 0;

  public update(_: number) {
    if(this.delta > 0 && this.veces < 10) {
      ++this.veces;
      this.objetoVirtual.transform.position.add(Vector3.scale(this.anguloZoom, this.vel));
    }
    if(this.delta < 0 && this.veces > -6) {
      --this.veces;
      this.objetoVirtual.transform.position.sub(Vector3.scale(this.anguloZoom, this.vel));
    }
    this.delta = 0;
    
    if(this.pulsa) {      
      this.objetoVirtual.transform.rotation.rotateEuler(new Vector3(0, this.posPantalla.x - this.ultimaPos.x, 0));
      this.ultimaPos.copyFrom(this.posPantalla);
    }
  }

  public cargarConfiguracion() {
    Input.suscribirse(this);
    this.anguloZoom.copyFrom(Vector3.normalize(new Vector3(0, -8, -10)));
    this.ultimaPos.copyFrom(new Vector2( -1, -1));
  }

  public notificar(codigo: string, datos: DatosRaton) {
    if(codigo === ConstantesMensajeria.PULSAR_CLICK && !this.pulsa) {
      if(datos.btnCentral) {
        this.pulsa = true;        
        this.posPantalla = datos.posicion;
          this.ultimaPos.copyFrom(this.posPantalla);
      }
    }
    if(codigo === ConstantesMensajeria.MOVER_CLICK && this.pulsa) {
      this.posPantalla = datos.posicion;
    }
    if(codigo === ConstantesMensajeria.SOLTAR_CLICK && this.pulsa) {
      if(!datos.btnCentral) {
        this.pulsa = false;
        this.posPantalla = datos.posicion;
      }
    }
    if(codigo === ConstantesMensajeria.MOVER_RUEDA) {
      this.delta = datos.diferenciaScroll;
    }
  }
}