import Mesh from './mesh'

/**
 * Corresponde con una textura y un contador propio que lleva la cuenta de los objetos que la estan utilizando.
 * */
class UnidadDeMesh {
  public readonly mesh: Mesh;
  public referencias: number = 1;

  /**
   * Crea una unidad de textura con su identificador.
   * @param textura Textura a guardar.
   */
  public constructor(mesh: Mesh) {
      this.mesh = mesh;
  }
}

/**
* Gestiona las texturas. Patron sigleton.
* */
export default class Meshes {

  private static _meshes: { [nombre: string]: UnidadDeMesh } = {};

  private constructor() {

  }

  /**
   * Obtiene la textura y si no esta la crea.
   * @param nombre Nombre identificatorio de la textura.
   */
  public static obtenerMesh(nombre: string, nombreMaterial: string): Mesh {
      if (Meshes._meshes[nombre] === undefined) {
          const mesh: Mesh = new Mesh(nombre, nombreMaterial);
          Meshes._meshes[nombre] = new UnidadDeMesh(mesh);
      } else {
          Meshes._meshes[nombre].referencias++;
      }

      return Meshes._meshes[nombre].mesh;
  }

  /**
   * Destruye la textura y libera la memoria. 
   * @param nombre Nombre de la textura.
   */
  public static destruirTextura(nombre: string): void {
      if (Meshes._meshes[nombre] !== undefined) {
        Meshes._meshes[nombre].referencias--;
          if (Meshes._meshes[nombre].referencias < 1) {
            Meshes._meshes[nombre] = undefined;
            delete Meshes._meshes[nombre];
          }
      }
  }

}