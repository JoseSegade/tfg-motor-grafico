import EfectoSonido from './efectoSonido';

/**
 * Gestiona los audios.
 * */
export default class AudioManager {
    private static _effectosSonido: { [nombre: string]: EfectoSonido } = {};

    /**
     * Carga un nuevo sonido.
     * @param nombre Nombre (identificador del objeto).
     * @param ruta Directorio del sonido.
     * @param loop True para que se reproduzca en bucle una vez se haya terminado.
     */
    public static loadSoundFile(nombre: string, ruta: string, loop: boolean): void {
        AudioManager._effectosSonido[nombre] = new EfectoSonido(ruta, loop);
    }

    /**
     * Reproduce el sonido especificado.
     * @param nombre Nombre que identifica el sonido.
     */
    public static reproducirsSonido(nombre: string): void {
        if (AudioManager._effectosSonido[nombre] !== undefined) {
            AudioManager._effectosSonido[nombre].reproducir();
        }
    }

    /**
     * Pausa el sonido especificado.
     * @param nombre Nombre que identifica el sonido.
     */
    public static pausarSonido(nombre: string): void {
        if (AudioManager._effectosSonido[nombre] !== undefined) {
            AudioManager._effectosSonido[nombre].pausar();
        }
    }

    /**
     * Para el sonido especificado para que la proxima vez se reproduzca desde el principio.
     * @param nombre Nombre que identifica el sonido.
     */
    public static pararSonido(nombre: string): void {
        if (AudioManager._effectosSonido[nombre] !== undefined) {
            AudioManager._effectosSonido[nombre].parar();
        }
    }

    /**
     * Pausa todos los audios.
     * */
    public static pausarTodo(): void {
        Object.keys(AudioManager._effectosSonido).forEach((nombreAudio) => {
            AudioManager._effectosSonido[nombreAudio].pausar();
        });
    }

    /**
     * Para todos los audios y los configura para que al reproducirse lo hagan desde el principio.
     * */
    public static pararTodo(): void {
        Object.keys(AudioManager._effectosSonido).forEach((nombreAudio) => {
            AudioManager._effectosSonido[nombreAudio].parar();
        });
    }
}
