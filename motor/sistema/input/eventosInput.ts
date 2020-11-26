import Vector2 from '../../fisica/matematicas/vector2';
import ConstantesMensajeria from '../../constantes/constantesMensajeria';
import DatosRaton from './datosRaton';
import Input from './input';

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
    private static _clickIzd  = false;
    private static _clickDch = false;
    private static _clickCen = false;
    private static _deltaScroll = 0;
    private static _resolucion: Vector2 = Vector2.one;

    /**
     * Inicializa los listeners de los eventos html.
     * */
    public static inicializar(viewport: HTMLCanvasElement): void {
        EventosInput._teclas = new Array<boolean>(255);

        // teclado
        window.addEventListener('keydown', EventosInput.pulsarTecla);
        window.addEventListener('keyup', EventosInput.soltarTecla);

        // raton
        viewport.addEventListener('mousemove', EventosInput.moverCursor);
        viewport.addEventListener('mousedown', EventosInput.pulsarClick);
        viewport.addEventListener('mouseup', EventosInput.soltarClick);
        viewport.addEventListener('wheel', EventosInput.moverRueda);
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

    
    private static pulsarTecla(event: KeyboardEvent): boolean {
        EventosInput._teclas[event.key] = true;
        return true;
    }
    
    private static soltarTecla(event: KeyboardEvent): boolean {
        EventosInput._teclas[event.key] = false;
        return true;
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

    private static moverCursor(event: MouseEvent): void {
        const rect: DOMRect = (event.target as HTMLElement).getBoundingClientRect();
        EventosInput._cursorX =
        Math.floor((event.clientX - Math.floor(rect.left)) * (1 / EventosInput._resolucion.x));
        EventosInput._cursorY =
        Math.floor((event.clientY - Math.floor(rect.top)) * (1 / EventosInput._resolucion.y));
        Input.notificar(
            ConstantesMensajeria.MOVER_CLICK,
            new DatosRaton(
                EventosInput._clickIzd,
                EventosInput._clickDch,
                EventosInput.obtenerPosicionCursor(),
                EventosInput._deltaScroll,
                EventosInput._clickCen
            ),
        );
    }

    private static pulsarClick(event: MouseEvent): void {
        if (event.button === 0) {
            EventosInput._clickIzd = true;
        } else if (event.button === 2) {
            EventosInput._clickDch = true;
        } else if (event.button === 1) {
            EventosInput._clickCen = true;
        }
        Input.notificar(
            ConstantesMensajeria.PULSAR_CLICK,
            new DatosRaton(
                EventosInput._clickIzd,
                EventosInput._clickDch,
                EventosInput.obtenerPosicionCursor(),
                EventosInput._deltaScroll,
                EventosInput._clickCen
            ),
        );
    }

    private static soltarClick(event: MouseEvent): void {
        if (event.button === 0) {
            EventosInput._clickIzd = false;
        } else if (event.button === 2) {
            EventosInput._clickDch = false;
        }else if (event.button === 1) {
            EventosInput._clickCen = false;
        }

        Input.notificar(
            ConstantesMensajeria.SOLTAR_CLICK,
            new DatosRaton(
                EventosInput._clickIzd,
                EventosInput._clickDch,
                EventosInput.obtenerPosicionCursor(),
                EventosInput._deltaScroll,
                EventosInput._clickCen
            ),
        );
    }

    private static moverRueda(event: WheelEvent): void {
        EventosInput._deltaScroll = event.deltaY;
        Input.notificar(
            ConstantesMensajeria.MOVER_RUEDA,
            new DatosRaton(
                EventosInput._clickIzd,
                EventosInput._clickDch,
                EventosInput.obtenerPosicionCursor(),
                EventosInput._deltaScroll,
                EventosInput._clickCen
            ),
        );
    }
}
