
/**
 * Interfaz para objetos encargados de importar un recurso.
 * */
export default interface Importador {
    readonly extensiones: string[];
    cargarRecurso(assetName: string): void;
}