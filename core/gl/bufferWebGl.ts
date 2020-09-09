import { gl } from './gl';
import AttributeInfo from './attributeInfo';
import ConstantesError from '../constantes/ConstantesError';

/**
 * Guarda la configuracion de un Buffer de WebGL. Wrapper del buffer.
 * */
export default class BufferWebGl {

    private _tieneIdAtributo: boolean = false;
    private _tamanoPorElemento: number;
    private _stride: number;
    private _buffer: WebGLBuffer;

    private _tipoBuffer: number;
    private _tipoDato: number;
    private _modo: number;
    private _tamanoDato: number;

    private _datos: number[] = [];
    private _atributos: AttributeInfo[] = [];

    /**
     * Construye un nuevo buffer.
     * @param tipoDato Tipo de datos que usa el buffer gl.FLOAT (Por defecto) | gl.INT | gl.UNSIGNED_INT | gl.SHORT | gl.UNSIGNED_SHORT | gl.BYTE | gl.UNSIGNED_BYTE.
     * @param tipoBuffer El tipo de buffer que puede ser gl.ARRAY_BUFFER (Por defecto) | gl.ELEMENT_ARRAY_BUFFER.
     * @param modo El tipo de pintado que hace el shader. Por defecto (gl.Triangles).
     */
    public constructor(tipoDato: number = gl.FLOAT, tipoBuffer: number = gl.ARRAY_BUFFER, modo: number = gl.TRIANGLES) {
        this._tamanoPorElemento = 0;
        this._tipoDato = tipoDato;
        this._tipoBuffer = tipoBuffer;
        this._modo = modo;

        switch (this._tipoDato) {
            case gl.FLOAT:
            case gl.INT:
            case gl.UNSIGNED_INT:
                this._tamanoDato = 4;
                break;
            case gl.SHORT:
            case gl.UNSIGNED_SHORT:
                this._tamanoDato = 2;
                break;
            case gl.BYTE:
            case gl.UNSIGNED_BYTE:
                this._tamanoDato = 1;
                break;
            default:
                throw new Error(ConstantesError.ERROR_TIPO_DATO);
        }

        this._buffer = gl.createBuffer();
    }

    /**
     * Destruye el buffer.
     * */
    public destroy(): void {
        gl.deleteBuffer(this._buffer);
    }

    /**
     * Junta (ata) el buffer al programa de WebGl.
     * @param normalizado True indica que los datos deben estar normalizados entre 0 y 1.
     */
    public bind(normalizado: boolean = false): void {
        gl.bindBuffer(this._tipoBuffer, this._buffer);

        if (this._tieneIdAtributo) {
            this._atributos.forEach(a => {
                gl.vertexAttribPointer(a.id, a.tamano, this._tipoDato, normalizado, this._stride, a.offset * this._tamanoDato);
                gl.enableVertexAttribArray(a.id);
            });
        }
    }

    /**
     * Separa (desata) el buffer al programa de WebGl. 
     * */
    public unbind(): void {
        if (this._tieneIdAtributo) {
            this._atributos.forEach(a => {
                gl.disableVertexAttribArray(a.id);
            });
        }
        gl.bindBuffer(this._tipoBuffer, undefined);
    }

    /**
     * Anade un nuebo atributo al buffer.
     * @param info Atributo que desea anadirse.
     */
    public anadirIdAtributo(info: AttributeInfo): void {
        this._tieneIdAtributo = true;
        info.offset = this._tamanoPorElemento;
        this._atributos.push(info);
        this._tamanoPorElemento += info.tamano;
        this._stride = this._tamanoPorElemento * this._tamanoDato;
    }

    /**
     * Reemplaza los datos que hay en el buffer por los que se pasan por parametro.
     * @param datos Datos que se quieren cargar en el buffer.
     */
    public reemplazarDatos(datos: number[]): void {
        this.limpiarBuffer();
        this.agregarDatos(datos);
    }

    /**
     * Anade nuevos datos al buffer.
     * @param datos Datos a anadir.
     */
    public agregarDatos(datos: number[]): void {
        this._datos = this._datos.concat(datos);
    }

    /**
     * Limpia los datos del buffer.
     * */
    public limpiarBuffer(): void {
        this._datos.splice(0, this._datos.length);
    }

    /**
     * Carga los datos en memoria del buffer de WebGl.
     * */
    public cargarBufferEnWebGl(): void {
        gl.bindBuffer(this._tipoBuffer, this._buffer);

        let datosBuffer: ArrayBuffer;
        switch (this._tipoDato) {
            case gl.FLOAT:
                datosBuffer = new Float32Array(this._datos);
                break;
            case gl.INT:
                datosBuffer = new Int32Array(this._datos);
                break;
            case gl.UNSIGNED_INT:
                datosBuffer = new Uint32Array(this._datos);
                break;
            case gl.SHORT:
                datosBuffer = new Int16Array(this._datos);
                break;
            case gl.UNSIGNED_SHORT:
                datosBuffer = new Uint16Array(this._datos);
                break;
            case gl.BYTE:
                datosBuffer = new Int8Array(this._datos);
                break;
            case gl.UNSIGNED_BYTE:
                datosBuffer = new Uint8Array(this._datos);
                break;
            default:
                throw new Error(ConstantesError.ERROR_TIPO_DATO_CARGA_MEMORIA);
        }

        gl.bufferData(this._tipoBuffer, datosBuffer, gl.STATIC_DRAW);
    }

    /** 
     * Dibuja el buffer.
     *  */
    public dibujar(): void {
        if (this._tipoBuffer === gl.ARRAY_BUFFER) {
            gl.drawArrays(this._modo, 0, this._datos.length / this._tamanoPorElemento);
        }
        else if (this._tipoBuffer === gl.ELEMENT_ARRAY_BUFFER) {
            gl.drawElements(this._modo, this._datos.length, this._tipoDato, 0);
        }
    }

}

