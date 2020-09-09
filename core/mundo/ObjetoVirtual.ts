import Matrix4x4 from '../math/matrix4x4';
import Vector3 from '../math/vector3';
import Funcionalidad from '../funcionalidades/Funcionalidad';
import Componente from '../componentes/componente';
import Transform from '../math/transform';
import Shader from '../gl/shader';
import MundoVirtual from './mundoVirtual';

/**
 * Objeto que se renderizara en una escena
 * */
export default class ObjetoVirtual {
    private _id: number;
    private _objetosHijo: ObjetoVirtual[] = [];
    private _objetoPadre: ObjetoVirtual;
    private _estaConfigurado: boolean = false;
    private _mundoVirtual: MundoVirtual;
    private _componentes: Componente[] = [];
    private _funcionalidades: Funcionalidad[] = [];
    private _esVisible: boolean = true;

    private _localM: Matrix4x4 = Matrix4x4.identity;
    private _worldM: Matrix4x4 = Matrix4x4.identity;

    /**
     *  Nombre (identificador del objeto).
     * */
    public nombre: string;

    /**
     * Transformada del objeto.
     * */
    public transform: Transform = new Transform();

    /**
     * Creates a new object to render in the scene.
     * @param id Id of the object.
     * @param name Name to identify the object.
     * @param scene Scene to bind this object to. Required just in the container of all the rest of the objects.
     */
    public constructor(id: number, nombre: string, mundoVirtual?: MundoVirtual) {
        this._id = id;
        this.nombre = nombre;
        this._mundoVirtual = mundoVirtual;
    }

    public get mundoVirtual(): MundoVirtual {
        return this._mundoVirtual;
    }

    /**
     * Id del objeto.
     */
    public get id(): number {
        return this._id;
    }

    /**
     * Objeto padre.
     */
    public get objetoPadre(): ObjetoVirtual {
        return this._objetoPadre;
    }

    /**
     * Devuelve la matriz con las coordenadas del mundo.
     */
    public get worldMatrix(): Matrix4x4 {
        return this._worldM;
    }

    /**
     * True si el objeto ya ha sido configurado.
     */
    public get estaConfigurado(): boolean {
        return this._estaConfigurado;
    }

    /**
     * True si el objeto sera visible dentro del render.
     * */
    public get esVisible(): boolean {
        return this._esVisible;
    }

    /**
     * True para mostrar el objeto en el render, false para que no se pinte
     * */
    public set esVisible(value: boolean) {
        this._esVisible = value;
    }

    /**
     * Anida un objeto como hijo en la jerarquia.
     * @param objetoHijo Objeto hijo.
     */
    public anadirObjetoHijo(objetoHijo: ObjetoVirtual): void {
        objetoHijo._objetoPadre = this;
        this._objetosHijo.push(objetoHijo);
        objetoHijo.referenciaMundoVirtual(this._mundoVirtual);
    }

    /**
     * Elimina el objeto hijo de la jerarquia.
     * @param objetoHijo El objeto que se quiere eliminar.
     */
    public eliminarObjetoHijo(objetoHijo: ObjetoVirtual): void {
        const idx = this._objetosHijo.indexOf(objetoHijo);
        if (idx !== -1) {
            objetoHijo._objetoPadre = undefined;
            this._objetosHijo.splice(idx, 1);
        }
    }

    /**
     * Busca el objeto a traves del nombre que lo identifique. Devuelve undefined si no lo encuentra
     * @param nombre Nombre del objeto que se quiere buscar.
     */
    public obtenerObjeto(nombre: string): ObjetoVirtual {
        if (this.nombre === nombre) {
            return this;
        }

        for (let objetoHijo of this._objetosHijo) {
            const objetoVirtual: ObjetoVirtual = objetoHijo.obtenerObjeto(nombre);
            if (objetoVirtual !== undefined) {
                return objetoVirtual;
            }
        }

        return undefined;
    }

    /**
     * Busca recursivamente el componente a traves del nombre que lo identifique. Devuelve undefined si no lo encuentra.
     * @param nombre Nombre del componente que se quiere buscar.
     */
    public obtenerComponente(nombre: string): Componente {
        const [componente] = this._componentes.filter((c) => c.nombre === nombre);
        if (!componente) {
            for (let objetoHijo of this._objetosHijo) {
                const componente: Componente = objetoHijo.obtenerComponente(nombre);
                if (componente !== undefined) {
                    return componente;
                }
            }
            return undefined;
        }
        return componente as Componente;
    }

    /**
     * Busca recursivamente la funcionalidad a traves del nombre que lo identifique. Devuelve undefined si no lo encuentra.
     * @param nombre Nombre de la funcionalidad que se quiere buscar.
     */
    public obtenerFuncionalidad(nombre: string): Funcionalidad {
        const [funcionalidad] = this._funcionalidades.filter((c) => c.nombre === nombre);
        if (!funcionalidad) {
            for (let objetoHijo of this._objetosHijo) {
                const funcionalidad: Funcionalidad = objetoHijo.obtenerFuncionalidad(name);
                if (funcionalidad !== undefined) {
                    return funcionalidad;
                }
            }
            return undefined;
        }
        return funcionalidad as Funcionalidad;
    }

    public obtenerTodasLasFuncionalidades(): Funcionalidad[] {
        return this._funcionalidades;
    }

    /**
     * Anade un nuevo componente a este objeto.
     * @param componente Componente que se quiere anadir.
     */
    public agregarComponente(componente: Componente): void {
        this._componentes.push(componente);
        componente.cambiarObjetoVirtual(this);
    }

    /**
     * Anade un nuevo componente a este objeto.
     * @param comportamiento Componente que se quiere anadir.
     */
    public agregarFuncionalidad(funcionalidad: Funcionalidad): void {
        this._funcionalidades.push(funcionalidad);
        funcionalidad.cambiarObjetoVirtual(this);
    }

    /**
     * Carga la configuracion de este objeto virtual y de todos los objetos hijo de la jerarquia.
     * */
    public cargarConfiguracion(): void {
        this._estaConfigurado = true;
        this._componentes.forEach((c) => c.cargarConfiguracion());
        this._funcionalidades.forEach((c) => c.cargarConfiguracion());
        this._objetosHijo.forEach((c) => c.cargarConfiguracion());
    }

    /**
     * Activa este objeto y cada uno de sus hijos.
     * */
    public activar(): void {
        this._componentes.forEach((c) => c.activar());
        this._funcionalidades.forEach((c) => c.activar());
        this._objetosHijo.forEach((c) => c.activar());
    }

    /**
     * Actualiza este objeto y todos sus hijos.
     * @param milisegundos Tiempo transcurrido desde la ultima actualizacion.
     */
    public update(milisegundos: number): void {
        this._localM = this.transform.getTransformationMatrix();
        this.actualizarMatrizGlobal(
            this.objetoPadre !== undefined ? this.objetoPadre._worldM : undefined,
        );

        this._componentes.forEach((c) => c.update(milisegundos));
        this._funcionalidades.forEach((c) => c.update(milisegundos));
        this._objetosHijo.forEach((c) => c.update(milisegundos));
    }

    /**
     * Renderiza este objeto y todos sus hijos.
     * @param shader Shader para renderizar.
     */
    public render(shader: Shader): void {
        if (this._esVisible) {
            this._componentes.forEach((c) => c.render(shader));
            this._objetosHijo.forEach((c) => c.render(shader));
        }
    }

    /**
     * Devuelve la posicion en coordenadas del mundo.
     * */
    public obtenerPosicionGlobal(): Vector3 {
        return new Vector3(this._worldM.data[12], this._worldM.data[13], this._worldM.data[14]);
    }

    /**
     * Anade una referencia al mundo virtual para poder mandar informacion en caso de que fuese necesario.
     * @param mundoVirtual Referencia al mundo virtual en el que se mete este objeto.
     */
    protected referenciaMundoVirtual(mundoVirtual: MundoVirtual): void {
        this._mundoVirtual = mundoVirtual;
    }

    private actualizarMatrizGlobal(matrizPadre: Matrix4x4): void {
        if (matrizPadre !== undefined) {
            this._worldM = Matrix4x4.multiply(matrizPadre, this._localM);
        } else {
            this._worldM.copyFrom(this._localM);
        }
    }
}
