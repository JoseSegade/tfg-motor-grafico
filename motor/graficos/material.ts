import Color from "./color";
import Textura from "./textura";
import Texturas from "./texturas";

/**
 * Guarda los datos correspondientes con el material de un objeto, con texturas y colores.
 * */
export default class Material {
    private _nombre: string;
    private _nombreTexturaDifusa: string;
    private _texturaDifusa: Textura;
    private _color: Color;

    public constructor(nombre: string, nombreTexturaDifusa: string, color: Color) {
        this._nombre = nombre;
        this._nombreTexturaDifusa = nombreTexturaDifusa;
        this._color = color;

        if (this._nombreTexturaDifusa !== undefined) {
            this._texturaDifusa = Texturas.obtenerTextura(this._nombreTexturaDifusa);
        }
    }

    /**
     * Nombre del material.
     * */
    public get nombre(): string {
        return this._nombre;
    }

    /**
     * Nombre de la textura que da el color principal
     * */
    public get nombreTexturaDifusa(): string {
        return this._nombreTexturaDifusa;
    }

    /**
     * Textura difusa que da el color principal
     * */
    public get texturaDifusa(): Textura {
        return this._texturaDifusa;
    }

    /**
     * Color (albedo) del material.
     * */
    public get color(): Color {
        return this._color;
    }

    /**
     * Nombre de la textura difusa.
     * */
    public set nombreTexturaDifusa(value: string) {
        if (this._nombreTexturaDifusa !== undefined) {
            Texturas.destruirTextura(this.nombreTexturaDifusa);
        }

        this.nombreTexturaDifusa = value;

        if (this._nombreTexturaDifusa !== undefined) {
            this._texturaDifusa = Texturas.obtenerTextura(this._nombreTexturaDifusa);
        }
    }

    /**
     * Destruye el objeto y libera la memoria.
     * */
    public destroy(): void {
        Texturas.destruirTextura(this._nombreTexturaDifusa);
        this._texturaDifusa = undefined;
    }

}