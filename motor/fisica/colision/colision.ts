import ComponenteColision from '../../logica/componentes/componentesDefault/componenteColision';

/**
 * Almacena los datos de una colision.
 * */
export default class Colision {
    readonly a: ComponenteColision;
    readonly b: ComponenteColision;

    public constructor(a: ComponenteColision, b: ComponenteColision) {
        this.a = a;
        this.b = b;
    }
}
