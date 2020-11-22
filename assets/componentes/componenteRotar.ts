import Vector3 from "motor/fisica/matematicas/vector3";
import ComponenteBase from "motor/logica/componentes/componenteBase";

export default class ComponenteRotar extends ComponenteBase {

  public update(time: number) {

    this.objetoVirtual.transform.rotation.rotateEuler(new Vector3(time/5, 0, 0));
    this.objetoVirtual.worldMatrix.printInConsole();
    console.log(this.objetoVirtual.transform.rotation.toEulerAngles());
  }
}