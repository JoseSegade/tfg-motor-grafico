import Textura from "./textura";

/**
 * Corresponde con una textura y un contador propio que lleva la cuenta de los objetos que la estan utilizando.
 * */
class UnidadDeTextura {
    public readonly textura: Textura;
    public referencias: number = 1;

    /**
     * Crea una unidad de textura con su identificador.
     * @param textura Textura a guardar.
     */
    public constructor(textura: Textura) {
        this.textura = textura;
    }
}

/**
 * Gestiona las texturas. Patron sigleton.
 * */
export default class Texturas {

    private static _texturas: { [nombre: string]: UnidadDeTextura } = {};

    private constructor() {

    }

    /**
     * Obtiene la textura y si no esta la crea.
     * @param nombre Nombre identificatorio de la textura.
     */
    public static obtenerTextura(nombre: string): Textura {
        if (Texturas._texturas[nombre] === undefined) {
            const textura: Textura = new Textura(nombre);
            Texturas._texturas[nombre] = new UnidadDeTextura(textura);
        } else {
            Texturas._texturas[nombre].referencias++;
        }

        return Texturas._texturas[nombre].textura;
    }

    /**
     * Destruye la textura y libera la memoria. 
     * @param nombre Nombre de la textura.
     */
    public static destruirTextura(nombre: string): void {
        if (Texturas._texturas[nombre] !== undefined) {
            Texturas._texturas[nombre].referencias--;
            if (Texturas._texturas[nombre].referencias < 1) {
                Texturas._texturas[nombre].textura.destroy();
                Texturas._texturas[nombre] = undefined;
                delete Texturas._texturas[nombre];
            }
        }
    }

}
