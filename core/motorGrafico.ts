﻿import ShaderBase from './gl/shaders/shaderBase';
import SuscripcionMensaje from './mensajes/suscripcionMensaje';
import Matrix4x4 from './math/matrix4x4';
import Importadores from './importadores/Importadores';
import EventosInput from './input/eventosInput';
import NivelManager from './mundo/nivelManager';
import WebGl_Util, { gl } from './gl/gl';
import Vector2 from './math/vector2';
import Mensaje from './mensajes/Mensaje';
import CanalMensaje from './mensajes/CanalMensajes';
import Colisiones from './colision/colisiones';
import Color from './graficos/color';
import FuentesBitmap from './graficos/fuentesBitmap';
import Materiales from './graficos/materiales';
import Material from './graficos/material';
import { RecursosLeidos } from './importadores/lectorRecursos';
import Componentes from './componentes/componentes';
import Funcionalidades from './funcionalidades/funcionalidades';

/**
 * MotorGrafico
 * */
export default class MotorGrafico implements SuscripcionMensaje {
    private _canvas: HTMLCanvasElement;
    private _basicShader: ShaderBase;
    private _projection: Matrix4x4;
    private _previousTime: number = 0;

    private _gameWidth: number;
    private _gameHeight: number;

    private _isFirstUpdate: boolean = true;
    private _aspect: number;

    /**
     * Crea un nuevo motor.
     *  @param width The width of the game in pixels.
     *  @param height The height of the game in pixels.
     * */
    public constructor(width?: number, height?: number) {
        this._gameWidth = width;
        this._gameHeight = height;
    }

    public inicializarRecursosProgramables({
        componentes,
        funcionalidades,
        niveles,
    }: RecursosLeidos): void {
        Componentes.guardarComponentes(componentes);
        Funcionalidades.guardarfuncionalidades(funcionalidades);
        NivelManager.inicializarNiveles(niveles);
    }

    /**
     * Starts up this engine.
     * */
    public iniciar(elementName?: string): void {
        this._canvas = WebGl_Util.inicializarWebGl(elementName);
        if (this._gameWidth !== undefined && this._gameHeight !== undefined) {
            this._aspect = this._gameWidth / this._gameHeight;
        }
        Importadores.inicializar();
        EventosInput.inicializar(this._canvas);

        gl.clearColor(146 / 225, 206 / 255, 247 / 255, 1);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        this._basicShader = new ShaderBase();
        this._basicShader.utilizarShader();

        FuentesBitmap.agregarFuente('default', 'assets/fonts/text.txt');
        FuentesBitmap.cargarConfiguracion();

        Materiales.agregarMaterial(new Material('duck', 'assets/textures/duck.png', Color.blanco));
        Materiales.agregarMaterial(new Material('bg', 'assets/textures/bg.png', Color.blanco));
        Materiales.agregarMaterial(new Material('end', 'assets/textures/end.png', Color.blanco));
        Materiales.agregarMaterial(
            new Material('middle', 'assets/textures/middle.png', Color.blanco),
        );
        Materiales.agregarMaterial(
            new Material('grass', 'assets/textures/grass.png', Color.blanco),
        );
        Materiales.agregarMaterial(
            new Material('tutorial', 'assets/textures/tutorial.png', Color.blanco),
        );
        Materiales.agregarMaterial(
            new Material('title', 'assets/textures/title.png', Color.blanco),
        );
        Materiales.agregarMaterial(
            new Material('score', 'assets/textures/score.png', Color.blanco),
        );
        Materiales.agregarMaterial(
            new Material('restartbtn', 'assets/textures/restartbtn.png', Color.blanco),
        );
        Materiales.agregarMaterial(
            new Material('playbtn', 'assets/textures/playbtn.png', Color.blanco),
        );

        //  Load an audio
        //AudioManager.loadSoundFile('flap', 'assets/sounds/flap.mp3', false);

        this._projection = Matrix4x4.ortographic(
            0,
            this._canvas.width,
            this._canvas.height,
            0,
            -100.0,
            100.0,
        );

        this.cambiarTamano(this._gameWidth, this._gameHeight);

        this.precargar();
    }

    /**
     * Resizes the canvas to fit the window.
     * */
    public cambiarTamano(anchoVentana: number, altoVentana: number): void {
        if (this._canvas !== undefined) {
            if (!this._gameWidth || !this._gameHeight) {
                this._canvas.width = anchoVentana;
                this._canvas.height = altoVentana;
                gl.viewport(0, 0, anchoVentana, altoVentana);
                this._projection = Matrix4x4.ortographic(
                    0,
                    anchoVentana,
                    altoVentana,
                    0,
                    -100.0,
                    100.0,
                );
            } else {
                let newWidth: number = anchoVentana;
                let newHeight: number = altoVentana;
                const newWidthToHeight: number = newWidth / newHeight;
                const gameArea: HTMLElement = document.getElementById('gameArea');

                if (newWidthToHeight > this._aspect) {
                    newWidth = newHeight * this._aspect;
                } else {
                    newHeight = newWidth * this._aspect;
                }
                gameArea.style.width = `${newWidth}px`;
                gameArea.style.height = `${newHeight}px`;

                gameArea.style.marginLeft = `${-newWidth / 2}px`;
                gameArea.style.marginTop = `${-newHeight / 2}px`;

                this._canvas.width = newWidth;
                this._canvas.height = newHeight;

                gl.viewport(0, 0, newWidth, newHeight);
                this._projection = Matrix4x4.ortographic(
                    0,
                    this._gameWidth,
                    this._gameHeight,
                    0,
                    -100.0,
                    100.0,
                );

                const resolutionScale: Vector2 = new Vector2(
                    newWidth / this._gameWidth,
                    newHeight / this._gameHeight,
                );
                EventosInput.cambiarResolucion(resolutionScale);
            }
        }
    }

    /**
     * Gets the subscription message.
     * @param message Message sent.
     */
    public recibirMensaje(_mensaje: Mensaje): void {}

    private loop(): void {
        if (this._isFirstUpdate) {
        }

        this.update();
        this.render();
        requestAnimationFrame(this.loop.bind(this));
    }

    private precargar(): void {
        CanalMensaje.update(0);

        if (!FuentesBitmap.estanActivadas()) {
            requestAnimationFrame(this.precargar.bind(this));
        } else {
            NivelManager.cambiarNivel(0);
            this.loop();
        }
    }

    private update(): void {
        const delta: number = performance.now() - this._previousTime;

        CanalMensaje.update(delta);

        NivelManager.update(delta);

        Colisiones.update(delta);
        this._previousTime = performance.now();
    }

    private render(): void {
        gl.clear(gl.COLOR_BUFFER_BIT);

        NivelManager.render(this._basicShader);

        const projectionPosition: WebGLUniformLocation = this._basicShader.obtenerIdentificacion(
            'u_projection',
            true,
        );
        gl.uniformMatrix4fv(projectionPosition, false, new Float32Array(this._projection.data));
    }
}