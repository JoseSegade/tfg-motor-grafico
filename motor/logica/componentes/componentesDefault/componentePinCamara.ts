import Vector2 from "../../../fisica/matematicas/vector2";
import Clickable from "../../../sistema/input/clickable";
import DatosRaton from "../../../sistema/input/datosRaton";
import ComponenteBase from "../componenteBase";

export default class ComponentePinCamara extends ComponenteBase implements Clickable {
  public velocidad = 20;
  public zonaMuerta = 10;
  public limite = Vector2.zero;

  public scrollSpeed = 20;
  public minY;
  public maxY;

  public notificar(codigo: string, datos:DatosRaton) {

  }
}