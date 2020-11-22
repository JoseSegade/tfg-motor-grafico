import Componente from './componente';
import ObjetoVirtual from '../escena/objetoVirtual';
/**
 * Clase principal de la que deben heredar todos los componentes que se programen.
 * */
export default abstract class ComponenteBase implements Componente {
    /**
     *  Objeto virtual al que se le ha asociado el componente
     *  */
    public objetoVirtual: ObjetoVirtual;

    /**
     * Nombre del componente
     * */
    public nombre: string;

    /**
     * Cambia el objeto virtual al que pertenece este componente.
     * @param objetoVirtual Objeto virtual al que se asignara el componente.
     */
    public cambiarObjetoVirtual(objetoVirtual: ObjetoVirtual): void {
        this.objetoVirtual = objetoVirtual;
    }

    /**
     * Carga la configuracion del componente.
     * */
    public cargarConfiguracion(): void {}

    /**
     * Activa el componente la primera vez que se ejecuta.
     * */
    public activar(): void {}

    /**
     * Actualiza los datos del componente.
     * @param _milisegundos Milisegundos desde la ultima actualizacion.
     */
    public update(_milisegundos: number): void {}    
}
