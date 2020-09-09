import Material from "./material";

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

    private constructor() {

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

    /**
     * Obtiene el material buscado por nombre. Undefined si no lo encuentra.
     * @param nombre Nombre del material que se quiere buscar.
     */
    public static obtenerMaterial(nombre: string): Material {
        if (Materiales._materiales[nombre] === undefined) {
            return undefined;
        }
        else {
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