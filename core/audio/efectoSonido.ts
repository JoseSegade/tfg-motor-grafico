/**
 * Efecto de sonido.
 * */
export default class EfectoSonido {
    private _audio: HTMLAudioElement;
    public assetPath: string;

    /**
     * Crea un nuevo objeto de sonido con el HTML correspondiente.
     * @param ruta Ruta donde esta guardada el objeto.
     * @param loop True para reproducir en bucle una vez se acabe.
     */
    public constructor(ruta: string, loop: boolean) {
        this._audio = new Audio(ruta);
        this._audio.loop = loop;
    }

    /**
     * Destruye el componente HTML de este audio.
     * */
    public destroy(): void {
        this._audio = undefined;
    }

    /**
     * Devuelve true si el audio esta configurado para reproducirse en bucle.
     * */
    public get loop(): boolean {
        return this._audio.loop;
    }

    /**
     * Cambia la configuracion del audio para reproducirse en bucle (true) o no.
     * */
    public set loop(value: boolean) {
        this._audio.loop = value;
    }

    /**
     * Reproduce el efecto de sonido.
     * */
    public reproducir(): void {
        if (!this._audio.paused) {
            this.parar();
        }
        this._audio.play();
    }

    /**
     * Pausa el efecto de sonido.
     * */
    public pausar(): void {
        this._audio.pause();
    }

    /**
     * Para el efecto de sonido y lo configura para que empieze desde el principio
     * */
    public parar(): void {
        this._audio.pause();
        this._audio.currentTime = 0;
    }
}
