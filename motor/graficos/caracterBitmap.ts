
/**
 * Almacena la informacion de un caracter. Coincide con la informacion que se pasa por el archivo de fuente.
 * */
export default class CaracterBitmap {

    /**
     * Id del caracter
     * */
    public id: number;

    /**
     * Posicion x en el mapa de bits.
     * */
    public x: number;

    /**
     * Posicion x en el mapa de bits.
     * */
    public y: number;

    /**
     * Ancho que ocupa en el mapa de bits.
     * */
    public width: number;

    /**
    * Alto que ocupa en el mapa de bits.
    * */
    public height: number;

    /**
     * Desfase en el eje x del caracter sobre el caracter anterior.
     * */
    public xOffset: number;

    /**
    * Desfase en el eje y del caracter sobre el caracter anterior.
    * */
    public yOffset: number;

    /**
    * Desfase sobre el final del caracter.
    * */
    public xAdvance: number;

    /**
    * Pagina (pueden existir varios bitmap para un mismo abecedario) donde se encuentra el caracter.
    * */
    public page: number;

    /**
    * Canal donde se encuentra el caracter.
    * */
    public channel: number;

    /**
     * Guarda la informacion de cada caracter.
     * @param fields
     */
    public static separarCampos(fields: string[]): CaracterBitmap {
        const caracter: CaracterBitmap = new CaracterBitmap();

        caracter.id = Number(CaracterBitmap.extraerValor(fields[1]));
        caracter.x = Number(CaracterBitmap.extraerValor(fields[2]));
        caracter.y = Number(CaracterBitmap.extraerValor(fields[3]));
        caracter.width = Number(CaracterBitmap.extraerValor(fields[4]));
        caracter.height = Number(CaracterBitmap.extraerValor(fields[5]));
        caracter.xOffset = Number(CaracterBitmap.extraerValor(fields[6]));
        caracter.yOffset = Number(CaracterBitmap.extraerValor(fields[7]));
        caracter.xAdvance = Number(CaracterBitmap.extraerValor(fields[8]));
        caracter.page = Number(CaracterBitmap.extraerValor(fields[9]));
        caracter.channel = Number(CaracterBitmap.extraerValor(fields[10]));

        return caracter;
    }

    /**
     * Extrae el valor del campo introducido, separado por '='
     * @param campo Campo cuyo valor se quiere extraer.
     */
    public static extraerValor(campo: string): string {
        return campo.split('=')[1];
    }
}
