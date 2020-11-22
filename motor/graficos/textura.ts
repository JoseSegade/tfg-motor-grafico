import { gl } from "../sistema/gl/canvasWebGl";
import SuscripcionMensaje from "../logica/mensajes/suscripcionMensaje";
import Mensaje from "../logica/mensajes/mensaje";
import RecursoImagen from "../logica/importadores/recursos/recursoImagen";
import ConstantesMensajeria from "../constantes/constantesMensajeria";
import Importadores from "../logica/importadores/importadores";


const LEVEL: number = 0;
const BORDER: number = 0;
const TEMP_IMAGE_DATA: Uint8Array = new Uint8Array([255, 255, 255, 255]);

/**
 * Guarda los datos reclacionados con una textura.
 * */
export default class Textura implements SuscripcionMensaje {

    private _nombre: string;
    private _textura: WebGLTexture;
    private _estaCargado: boolean = false;
    private _ancho: number;
    private _alto: number;

    /**
     * Crea un nuevo objeto textura 2D para usar en WebGl. Wrapper de las funciones.
     * @param nombre Nombre identificatiorio de la textura.
     * @param { number } ancho Ancho de la textura. 1 por defecto.
     * @param { number } alto Alto de la textura. 1 por defecto.
     */
    public constructor(nombre: string, ancho: number = 1, alto: number = 1) {
        this._nombre = nombre;
        this._ancho = ancho;
        this._alto = alto;
        this._textura = gl.createTexture();

        this.asociarTexturaAWebGL();

        gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, 1, 1, BORDER, gl.RGBA, gl.UNSIGNED_BYTE, TEMP_IMAGE_DATA);

        const recursoImagen: RecursoImagen = Importadores.obtenerRecurso(this._nombre) as RecursoImagen;
        if (recursoImagen !== undefined) {
            this.cargarTexturaDesdeRecurso(recursoImagen);
        }
        else {
            Mensaje.suscribirse(ConstantesMensajeria.RECURSO_CARGADO + this._nombre, this);
        }
    }

    private cargarTexturaDesdeRecurso(imagen: RecursoImagen): void {
        this._ancho = imagen.ancho;
        this._alto = imagen.ancho;

        this.asociarTexturaAWebGL();

        gl.texImage2D(gl.TEXTURE_2D, LEVEL, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagen.datos);

        if (this.esTexturaPotencia2()) {
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

        this._estaCargado = true;
    }

    private esTexturaPotencia2(): boolean {
        return (this.esPotencia2(this._ancho) && this.esPotencia2(this._alto));
    }

    private esPotencia2(n: number): boolean {
        return (n & (n - 1)) == 0;
    }

    /** 
     * Nombre de la textura. 
     * */
    public get nombre(): string {
        return this._nombre;
    }

    /** 
     *  True si la textura ya ha sido cargada para poder usarse. No tiene porque estar asociada con WebGl
     * */
    public get estaCargado(): boolean {
        return this._estaCargado;
    }

    /** 
     *  Ancho de textura.
     * */
    public get ancho(): number {
        return this._ancho;
    }

    /** 
     *  Alto de textura. 
     * */
    public get alto(): number {
        return this._alto;
    }

    /**
     * Elimina esta textura.
     * */
    public destroy(): void {
        gl.deleteTexture(this._textura);
    }

    /**
     * Crea un identificador para asociar la textura a webGl y la asocia.
     * @param id Identificador de la textura. 0 por defecto.
     */
    public activarYAsociarTextura(id: number = 0): void {
        gl.activeTexture(gl.TEXTURE0 + id);

        this.asociarTexturaAWebGL();
    }

    /**
     * Asocia la textura en memoria con WebGl.
     * */
    public asociarTexturaAWebGL(): void {
        gl.bindTexture(gl.TEXTURE_2D, this._textura);
    }

    /**
     * Libera la memoria de WebGL
     * */
    public liberarMemoriaWebGL(): void {
        gl.bindTexture(gl.TEXTURE_2D, undefined);
    }

    /**
     * Receives the message from the subscription and loads the texture from the asset imported.
     * @param message Message to receive.
     */
    public recibirMensaje(mensaje: Mensaje): void {
        if (mensaje.codigo === ConstantesMensajeria.RECURSO_CARGADO + this._nombre) {
            this.cargarTexturaDesdeRecurso(mensaje.contexto as RecursoImagen);
        }
    }
}
