import Forma2D from '../../graficos/shapes2D/Forma2D';
import Colisiones from '../../colision/colisiones';
import Colisionable from '../../colision/colisionable';
import ComponenteBase from '../componenteBase';

/**
 * Este componente agrega una forma 2d.
 * */
export default class ComponenteColision extends ComponenteBase {
    /**
     * Devuelve la forma 2D del componente.
     * */
    public forma: Forma2D;

    /**
     * True si el componente no se mueve. No se comparara con otros componentes estaticos.
     * */
    public estatico: boolean;

    /**
     * Devuelve true si el componente no se mueve. No se comparara con otros componentes estaticos.
     * */
    public get esEstatico(): boolean {
        return this.estatico;
    }

    /**
     * Carga en memoria la informacion necesaria para utilizar el componente.
     * */
    public cargarConfiguracion(): void {
        super.cargarConfiguracion();

        this.forma.posicion.copyFrom(
            this.objetoVirtual.obtenerPosicionGlobal().xy.sub(this.forma.origen),
        );

        Colisiones.agregarComponente(this);
    }

    /**
     * Actualiza el componente.
     * @param milisegundos Milisegundos desde la ultima actualizacion.
     */
    public update(milisegundos: number): void {
        this.forma.posicion.copyFrom(
            this.objetoVirtual.obtenerPosicionGlobal().xy.sub(this.forma.origen),
        );

        super.update(milisegundos);
    }

    /**
     * Se llama cuando el componente ha colisionado.
     * @param otro Componente externo con el que ha colisionado.
     */
    public alEntrarColision(otro: ComponenteColision): void {
        this.objetoVirtual
            .obtenerTodasLasFuncionalidades()
            .filter((f) => f.hasOwnProperty('alEntrarColision'))
            .forEach((f) => ((f as any) as Colisionable).alEntrarColision(otro.objetoVirtual));
    }

    /**
     * Se llama cuando el componente esta colisionado.
     * @param otro Componente externo con el que ha colisionado.
     */
    public alMantenerColision(otro: ComponenteColision): void {
        this.objetoVirtual
            .obtenerTodasLasFuncionalidades()
            .filter((f) => f.hasOwnProperty('alMantenerColision'))
            .forEach((f) => ((f as any) as Colisionable).alMantenerColision(otro.objetoVirtual));
    }

    /**
     * Se llama cuando el componente sale de la colision.
     * @param otro Componente externo con el que ha colisionado.
     */
    public alSalirColision(otro: ComponenteColision): void {
        this.objetoVirtual
            .obtenerTodasLasFuncionalidades()
            .filter((f) => f.hasOwnProperty('alSalirColision'))
            .forEach((f) => ((f as any) as Colisionable).alSalirColision(otro.objetoVirtual));
    }
}
