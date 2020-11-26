import Color from './color';
import Material from './material';

/**
 * Corresponde con un material y un contador propio que lleva la cuenta de los objetos que la estan utilizando.
 * */
class UnidadDeMaterial {
  public material: Material;
  public referencias: number = 1;

  public constructor(material: Material) {
    this.material = material;
  }
}

/**
 * Gestiona los materiales. Patron sigleton.
 * */
export default class Materiales {
  private static _materiales: { [nombre: string]: UnidadDeMaterial } = {};
  private static _listaTexturas: string[];
  private static readonly DEFAULTMAT: string = "__DEFAULT_MAT__";

  private constructor() {}

  public static set listaTexturas(texturas: string[]) {
    this._listaTexturas = texturas;
  }


  /**
   * Inicializa la lista de texturas lista para usarse.
   * 
   */
  public static inicializarMateriales(): void {
    this._listaTexturas.forEach((textura) => {
      Materiales.agregarMaterial(
        new Material(textura.split('.')[0], `/textures/${textura}`, Color.blanco),
      );
    });
  }

  /**
   * Agrega un nuevo material.
   * @param material Material que se quiere agregar.
   */
  public static agregarMaterial(material: Material): string {
    if (Materiales._materiales[material.nombre] === undefined) {
      Materiales._materiales[material.nombre] = new UnidadDeMaterial(material);
    }
    return material.nombre;
  }

  public static defaultMaterial(): Material {
    if(Materiales._materiales[Materiales.DEFAULTMAT] === undefined) {
      const ret = new Material(Materiales.DEFAULTMAT, undefined, Color.negro);
      Materiales.agregarMaterial(ret);
      return ret;
    }
    return Materiales._materiales[Materiales.DEFAULTMAT].material;
  }

  public static cargarMaterial(textura: string): void {
    Materiales.agregarMaterial(new Material(textura, `/textures/${textura}.png`, Color.blanco));
  }

  /**
   * Obtiene el material buscado por nombre. Undefined si no lo encuentra.
   * @param nombre Nombre del material que se quiere buscar.
   */
  public static obtenerMaterial(nombre: string): Material {
    if (Materiales._materiales[nombre] === undefined) {
      console.warn(
        'El material al que se esta refiriendo no esta cargado en memoria: Nombre del material:',
        nombre,
      );
      return undefined;
    } else {
      Materiales._materiales[nombre].referencias++;
      return Materiales._materiales[nombre].material;
    }
  }

  /**
   * Destruye el material y libera la memoria.
   * @param nombre Nombre del material que se quiere destruir.
   */
  public static destruirMaterial(nombre: string): void {
    if (Materiales._materiales[nombre] !== undefined) {
      Materiales._materiales[nombre].referencias--;
      if (Materiales._materiales[nombre].referencias < 1) {
        Materiales._materiales[nombre].material.destroy();
        Materiales._materiales[nombre].material = undefined;
        delete Materiales._materiales[nombre];
      }
    }
  }
}
