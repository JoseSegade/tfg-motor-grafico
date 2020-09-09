import Vector3 from "../math/vector3";
import Vector4 from "../math/vector4";

/**
 * Representa un color en rgb.
 * */
export default class Color {
    private _r: number;
    private _g: number;
    private _b: number;
    private _a: number;

    /**
     * Crea un nuevo color.
     * @param r Canal rojo.
     * @param g Canal verde.
     * @param b Canal azul.
     * @param a Canal alfa.
     */
    public constructor(r: number = 255, g: number = 255, b: number = 255, a: number = 255) {
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    /**
     * Canal rojo.
     **/
    public get r(): number {
        return this._r;
    }

    /**
     * Canal rojo normalizado entre 0 y 1.
     **/
    public get rFloat(): number {
        return this._r / 255.0;
    }

    /**
     * Canal rojo.
     **/
    public set r(value: number) {
        this._r = value;
    }

    /**
    * Canal verde.
    **/
    public get g(): number {
        return this._g;
    }

    /**
    * Canal verde normalizado entre 0 y 1.
    **/
    public get gFloat(): number {
        return this._g / 255.0;
    }

    /**
    * Canal verde
    **/
    public set g(value: number) {
        this._g = value;
    }

    /**
     * Canal azul.
     **/
    public get b(): number {
        return this._b;
    }

    /**
    * Canal azul normalizado entre 0 y 1.
    **/
    public get bFloat(): number {
        return this._b / 255.0;
    }

    /**
     * Canal azul.
     **/
    public set b(value: number) {
        this._b = value;
    }

    /**
     * Canal alfa.
     **/
    public get a(): number {
        return this._a;
    }

    /**
    * Canal alfa normalizado entre 0 y 1.
    **/
    public get aFloat(): number {
        return this._a / 255.0;
    }

    /**
     * Canal alfa.
     **/
    public set a(value: number) {
        this._a = value;
    }

    /**
     * Devuelve un array de numeros normalizado entre 0 y 1 cada valor.
     * */
    public toFloatArray(): number[] {
        return [this._r / 255.0, this._g / 255.0, this._b / 255.0, this._a / 255.0];
    }

    /**
    * Convierte el color en un vector 3 con los canales rojo, verde y azul, respectivamente.
    * Valores entre 0 y 1.
    * */
    public convertirAVector3(): Vector3 {
        return new Vector3(this._r / 255.0, this._g / 255.0, this._b / 255.0);
    }

    /**
    * Convierte el color en un vector 4 con los canales rojo, verde, azul y alfa, respectivamente.
    * Valores entre 0 y 1.
    * */
    public convertirAVector4(): Vector4 {
        return new Vector4(this._r / 255.0, this._g / 255.0, this._b / 255.0, this._a / 255.0);
    }

    /**
     * Convierte el color en un array que puede entender WebGl.
     * */
    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toFloatArray());
    }

    /**
     * Construye un nuevo color blanco.
     * */
    public static get blanco(): Color {
        return new Color(255, 255, 255, 255);
    }

    /**
     * Construye un nuevo color negro.
     * */
    public static get negro(): Color {
        return new Color(0, 0, 0, 255);
    }

    /**
     * Construye un nuevo color rojo.
     * */
    public static get rojo(): Color {
        return new Color(255, 0, 0, 255);
    }

    /**
     * Construye un nuevo color verde.
     * */
    public static get verde(): Color {
        return new Color(0, 255, 0, 255);
    }

    /**
     * Construye un nuevo color azul.
     * */
    public static get azul(): Color {
        return new Color(0, 0, 255, 255);
    }
}
