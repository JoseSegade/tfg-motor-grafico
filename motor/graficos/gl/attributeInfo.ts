/**
* Representa la informacion necesaria para almacenar las variables de atributo de los Buffer de WebGL
* */
export default class AttributeInfo {

    /**
    * El identificador de la variable location
    */
    public id: number;

    /**
    * El tamano en memoria que ocupa cada uno de los elementos que se cargan (por ejemplo Vector3 = 3).
    */
    public tamano: number;

    /**
    * Numero de elementos de desfase desde el inicio del buffer
    */
    public offset: number;

    /**
    * Inicializa los valores del buffer.
    * @param locationId El valor que tiene el identificador de la variable.
    * @param tamano El tamano en memoria que ocupa cada uno de los elementos que se cargan (por ejemplo Vector3 = 3).
    * @param offset Numero de elementos de desfase desde el inicio del buffer.
    */
    public cargar(id: number, tamano: number, offset?: number): void {
        this.id = id;
        this.tamano = tamano;
        this.offset = offset;
    }
}