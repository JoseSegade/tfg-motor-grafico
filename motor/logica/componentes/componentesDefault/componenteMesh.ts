import Mesh from "motor/graficos/mesh";
import Meshes from "motor/graficos/meshes";
import ViewProj from "motor/logica/escena/viewProj";
import Shader from "../../../sistema/gl/shader";
import ComponenteBase from "../componenteBase";
import Renderizable from "../renderizable";

export default class ComponenteMesh extends ComponenteBase implements Renderizable {
  private _mesh: Mesh;

  public nombre: string;
  public nombreMalla: string;
  public nombreMaterial: string;

  public cargarConfiguracion(): void {
    this._mesh = Meshes.obtenerMesh(this.nombreMalla, this.nombreMaterial)
  }

  public render(shader: Shader, camara: ViewProj) {
    this._mesh.dibujar(shader, this.objetoVirtual.worldMatrix, camara);
  }

}