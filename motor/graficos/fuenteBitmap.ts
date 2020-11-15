import SuscripcionMensaje from "../logica/mensajes/suscripcionMensaje";
import ConstantesMensajeria from "../constantes/constantesMensajeria";
import CaracterBitmap from "./caracterBitmap";
import Mensaje from "../logica/mensajes/mensaje";
import RecursoTexto from "../logica/importadores/recursos/recursoTexto";
import Importadores from "../logica/importadores/importadores";
import Vector2 from "../fisica/matematicas/vector2";
import ConstantesError from "../constantes/constantesError";
import Path from 'path';

/**
 * Carga y lee los valores de una fuente en formato bitmap.
 * */
export default class FuenteBitmap implements SuscripcionMensaje {
    private _nombre: string;
    private _nombreArchivo: string;
    private _textoCargado: boolean = false;
    private _archivoImagen: string;
    private _caracteres: { [id: number]: CaracterBitmap } = {}
    private _tamano: number;
    private _anchoImagen: number;
    private _altoImagen: number;

    /**
     * Crea una nueva fuente.
     * @param nombre Nombre de la fuente.
     * @param nombreArchivo Nombre del txt donde estan contenidos los datos de la fuente.
     */
    public constructor(nombre: string, nombreArchivo: string) {
        this._nombre = nombre;
        this._nombreArchivo = nombreArchivo;
    }

    /**
     * Nombre de la fuente.
     * */
    public get nombre(): string {
        return this._nombre;
    }

    /**
     * Tamano total.
     * */
    public get tamano(): number {
        return this._tamano;
    }

    /**
     * Ancho total del bitmap.
     * */
    public get anchoImagen(): number {
        return this._anchoImagen;
    }

    /**
     * Alto total del bitmap.
     * */
    public get altoImagen(): number {
        return this._altoImagen;
    }

    /**
     * Nombre del archivo de bitmap con el texto.
     * */
    public get nombreTextura(): string {
        return this._archivoImagen;
    }

    /**
     * True si el texto ya ha sido cargado
     * */
    public get estaCargado(): boolean {
        return this._textoCargado;
    }

    /**
     * Carga el texto en memoria.
     * */
    public cargarConfiguracion(): void {
        const texto = Importadores.obtenerRecurso(this._nombreArchivo);
        if (texto !== undefined) {
            this.extraerInformacionTxt((texto as RecursoTexto).datos);
        }
        else {
            Mensaje.suscribirse(ConstantesMensajeria.RECURSO_CARGADO + this._nombreArchivo, this);
        }
    }

    /**
     * Esta funcion se llama cuando recibe un mensaje de la suscripcion.
     * @param mensaje
     */
    public recibirMensaje(mensaje: Mensaje): void {
        if (mensaje.codigo === ConstantesMensajeria.RECURSO_CARGADO + this._nombreArchivo) {
            this.extraerInformacionTxt((mensaje.contexto as RecursoTexto).datos);
        }
    }

    /**
     * Obtiene un caracter concreto.
     * @param char Caracter que se quiere obtener. Devuelve '?' si no lo encuentra.
     */
    public obtenerCaracter(char: string): CaracterBitmap {
        const id: number = (this._caracteres[char.charCodeAt(0)] === undefined) ? 63 : char.charCodeAt(0);

        return this._caracteres[id];
    }

    /**
     * Calcula la medida total que tendria un texto concreto.
     * @param texto
     */
    public calcularMedidas(texto: string): Vector2 {
        const tamano: Vector2 = Vector2.zero;

        let maxX = 0;
        let x = 0;
        let y = 0;

        texto.split('').forEach(char => {
            switch (char) {
                case '\n':
                    maxX = Math.max(x, maxX);
                    x = 0;
                    y += this._tamano;
                    break;
                default:
                    x += this.obtenerCaracter(char).xAdvance;
                    break;
            }
        });

        tamano.set(maxX, y);
        return tamano;
    }

    private extraerInformacionTxt(content: string): void {
        let nChar: number = 0;
        const lineas: string[] = content.split('\n');
        lineas.forEach((linea) => {
            const datos: string = linea.replace(/\s\s+/g, ' ');
            const campos: string[] = datos.split(' ');
            switch (campos[0]) {
                case 'info':
                    this._tamano = Number(CaracterBitmap.extraerValor(campos[2]));
                    break;
                case 'common':
                    this._anchoImagen = Number(CaracterBitmap.extraerValor(campos[3]));
                    this._altoImagen = Number(CaracterBitmap.extraerValor(campos[4]));
                    break;
                case 'page':
                    this._archivoImagen = CaracterBitmap.extraerValor(campos[2]);
                    this._archivoImagen = this._archivoImagen.replace(/"/g, "");
                    this._archivoImagen = Path.join(process.cwd(), `/fonts/${this._archivoImagen}`);
                    break;
                case 'chars':
                    nChar = (Number(CaracterBitmap.extraerValor(campos[1])));
                    break;
                case 'char':
                    const caracter = CaracterBitmap.separarCampos(campos);
                    this._caracteres[caracter.id] = caracter;
                    break;
                case '':
                    break;
                default:
                    break;
            }
        });
        
        if (Object.keys(this._caracteres).filter(key => this._caracteres.hasOwnProperty(key)).length !== nChar) {
            throw new Error(ConstantesError.ERROR_CARACTERES);
        }

        this._textoCargado = true;
    }
}