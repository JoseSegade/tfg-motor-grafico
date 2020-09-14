import Vector2 from '../math/vector2';
import ConstantesMensajeria from '../constantes/ConstantesMensajeria';
import DatosRaton from './datosRaton';
import Mensaje from '../mensajes/Mensaje';

/**
 * Codigos de las flechas del teclado.
 * */
export enum FlechasTeclado {
    IZQUIERDA = 37,
    ARRIBA = 38,
    DERECHA = 39,
    ABAJO = 40,
}

/**
 * Comunica los eventos de teclado y de raton.
 * */
export default class EventosInput {
    private static _teclas: boolean[];
    private static _cursorX: number;
    private static _cursorY: number;
    private static _clickIzd: boolean = false;
    private static _clickDch: boolean = false;
    private static _resolucion: Vector2 = Vector2.one;

    /**
     * Inicializa los listeners de los eventos html.
     * */
    public static inicializar(viewport: HTMLCanvasElement): void {
        this._teclas = new Array<boolean>(255);

        // keyboard
        window.addEventListener('keydown', EventosInput.pulsarTecla);
        window.addEventListener('keyup', EventosInput.soltarTecla);

        // mouse
        viewport.addEventListener('mousemove', EventosInput.moverCursor);
        viewport.addEventListener('mousedown', EventosInput.pulsarClick);
        viewport.addEventListener('mouseup', EventosInput.soltarClick);
    }

    /**
     * Devuelve true si la tecla esta siendo pulsada.
     * @param codigoTecla Codigo de la tecla sobre la que se desea obtener la informacion.
     */
    public static teclaPulsada(codigoTecla: FlechasTeclado): boolean {
        return EventosInput._teclas[codigoTecla] === undefined
            ? false
            : EventosInput._teclas[codigoTecla];
    }

    /**
     * Obtiene un vector con la posicion x e y del raton.
     * */
    public static obtenerPosicionCursor(): Vector2 {
        return new Vector2(EventosInput._cursorX, EventosInput._cursorY);
    }

    /**
     * Cambia el factor de resolucion al haber cambiado el tamano del canvas.
     * @param resolucion
     */
    public static cambiarResolucion(resolucion: Vector2): void {
        EventosInput._resolucion.copyFrom(resolucion);
    }

    private static pulsarTecla(event: KeyboardEvent): boolean {
        EventosInput._teclas[event.key] = true;
        return true;
    }

    private static soltarTecla(event: KeyboardEvent): boolean {
        EventosInput._teclas[event.key] = false;
        return true;
    }

    private static moverCursor(event: MouseEvent): void {
        const rect: DOMRect = (event.target as HTMLElement).getBoundingClientRect();
        EventosInput._cursorX =
        Math.floor((event.clientX - Math.floor(rect.left)) * (1 / EventosInput._resolucion.x));
        EventosInput._cursorY =
        Math.floor((event.clientY - Math.floor(rect.top)) * (1 / EventosInput._resolucion.y));
        Mensaje.enviarPrioritariamente(
            ConstantesMensajeria.MOVER_CLICK,
            this,
            new DatosRaton(
                EventosInput._clickIzd,
                EventosInput._clickDch,
                EventosInput.obtenerPosicionCursor(),
            ),
        );
    }

    private static pulsarClick(event: MouseEvent): void {
        if (event.button === 0) {
            this._clickIzd = true;
        } else if (event.button === 2) {
            this._clickDch = true;
        }
        Mensaje.enviarPrioritariamente(
            ConstantesMensajeria.PULSAR_CLICK,
            this,
            new DatosRaton(
                EventosInput._clickIzd,
                EventosInput._clickDch,
                EventosInput.obtenerPosicionCursor(),
            ),
        );
    }

    private static soltarClick(event: MouseEvent): void {
        if (event.button === 0) {
            this._clickIzd = false;
        } else if (event.button === 2) {
            this._clickDch = false;
        }

        Mensaje.enviarPrioritariamente(
            ConstantesMensajeria.SOLTAR_CLICK,
            this,
            new DatosRaton(
                EventosInput._clickIzd,
                EventosInput._clickDch,
                EventosInput.obtenerPosicionCursor(),
            ),
        );
    }
}
