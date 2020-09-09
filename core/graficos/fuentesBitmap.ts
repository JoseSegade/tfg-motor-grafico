import FuenteBitmap from "./fuenteBitmap";
import ConstantesError from "../constantes/ConstantesError";

/**
 * Gestiona las fuentes bitmap que haya creadas.
 * */
export default class FuentesBitmap {
    private static _fuentes: { [nombre: string]: FuenteBitmap } = {};

    /**
     * Agrega una nueva fuente a la lista.
     * @param nombre Nombre de la fuente
     * @param nombreArchivo Nombre del archivo con la configuracion de la fuente.
     */
    public static agregarFuente(nombre: string, nombreArchivo: string): void {
        FuentesBitmap._fuentes[nombre] = new FuenteBitmap(name, nombreArchivo);
    }

    /**
     * Obtiene la fuente especificada.
     * @param nombre Nombre de la fuente.
     */
    public static obtenerFuente(nombre: string): FuenteBitmap {
        if (FuentesBitmap._fuentes[nombre] === undefined) {
            throw new Error(ConstantesError.ERROR_OBTENER_FUENTES);
        }

        return FuentesBitmap._fuentes[nombre];
    }

    /**
     * Carga en memoria la configuracion de todas las fuentes.
     * */
    public static cargarConfiguracion(): void {
        Object.keys(FuentesBitmap._fuentes).forEach(key => FuentesBitmap._fuentes[key].cargarConfiguracion());
    }

    /**
     * Devuelve true si todas las fuentes estan cargadas en memoria.
     * */
    public static estanActivadas(): boolean {
        if (Object.keys(FuentesBitmap._fuentes).some(key => !FuentesBitmap._fuentes[key].estaCargado)) {
            return false;
        }
        return true;
    }
}
