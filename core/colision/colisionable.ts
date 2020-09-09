import ObjetoVirtual from '../mundo/ObjetoVirtual';

/**
 * Define una interfaz para las funcionalidades que tengan un componente colision.
 * */
export default interface Colisionable {
    alEntrarColision(other: ObjetoVirtual): void;
    alMantenerColision(other: ObjetoVirtual): void;
    alSalirColision(other: ObjetoVirtual): void;
}
