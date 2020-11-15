/**
 * Interfaz base que representa un recurso externo que sea necesario cargar en memoria (imagen, texto, etc).
 * */
export default interface Recurso {
    readonly nombre: string;
    readonly datos: any;
}