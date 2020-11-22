import Transform from '../../fisica/matematicas/transform';
import ObjetoVirtual from './objetoVirtual';
import ConstantesError from 'motor/constantes/constantesError';
import Componente from '../componentes/componente';
import MundoVirtual from './mundoVirtual';
import Matrix4x4 from '../../fisica/matematicas/matrix4x4';

export default class Camara extends ObjetoVirtual {
  public isOrtho: boolean;
  private _projMat: Matrix4x4;
  private _viewMat: Matrix4x4;
  private _alto: number;
  private _ancho: number;
  public nearClip: number;
  public farClip: number;
  public anguloVision: number;

  public constructor(
    id: number,
    nombre: string,
    mundoVirtual?: MundoVirtual,
    isOrtho?: boolean,
    nearClip?: number,
    farClip?: number,
  ) {
    super(id, nombre, mundoVirtual);

    this.isOrtho = isOrtho || false;
    this.nearClip = nearClip || (this.isOrtho ? -100.0 : 0.001);
    this.nearClip = farClip || 1000.0;

    this.anguloVision = 60.0;
  }

  public updateProporcionCamara(ancho: number, alto: number): void {
    this._alto = alto;
    this._ancho = ancho;
  }

  public get proyectionMat(): Matrix4x4 {
    if (this.isOrtho) {
      return Matrix4x4.ortographic(0, this._alto, this._ancho, 0, this.nearClip, this.farClip);
    }
    return Matrix4x4.perspective(
      this._ancho / this._alto,
      this.anguloVision,
      this.nearClip,
      this.farClip,
    );
  }

  public agregarComponente(componente: Componente): void {
    if (typeof componente['render'] === 'function') {
      console.warn(ConstantesError.ERROR_CREAR_SHADER);
      return;
    }
    super.agregarComponente(componente);
  }
}
