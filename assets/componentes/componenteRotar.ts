import Quaternion from "motor/fisica/matematicas/quaternion";
import Vector3 from "motor/fisica/matematicas/vector3";
import ComponenteBase from "motor/logica/componentes/componenteBase";

export default class ComponenteRotar extends ComponenteBase {

  private time = 0.5;
  public update(time: number) {

    //this.objetoVirtual.transform.rotation.copyFrom(Quaternion.identity);
    this.objetoVirtual.transform.rotation.rotateEuler(new Vector3(0, this.time, 0));
  }
}