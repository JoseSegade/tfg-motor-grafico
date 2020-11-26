import ObjetoVirtual from './objetoVirtual';
import ConstantesError from 'motor/constantes/constantesError';
import Componente from '../componentes/componente';
import MundoVirtual from './mundoVirtual';
import Matrix4x4 from '../../fisica/matematicas/matrix4x4';
import ViewProj from './viewProj';
import Vector3 from 'motor/fisica/matematicas/vector3';
import Quaternion from 'motor/fisica/matematicas/quaternion';

export default class Camara extends ObjetoVirtual {
  public isOrtho: boolean;
  private _projMat: Matrix4x4;
  private _alto: number;
  private _ancho: number;
  private	_nearClip: number;
  private _farClip: number;
  private _anguloVision: number;

  public constructor(
    id: number,
    nombre: string,
    mundoVirtual?: MundoVirtual,
    isOrtho?: boolean,
    nearClip?: number,
    farClip?: number,
  ) {
    super(id, nombre, mundoVirtual);

    this._alto = 1;
    this._ancho = 1;
    this.isOrtho = isOrtho || false;
    this._nearClip = nearClip || (this.isOrtho ? -100.0 : 0.001);
    this._farClip = farClip || 1000.0;

    this.anguloVision = 60.0;

    this.changeProyectionMat();
  }

  public updateProporcionCamara(ancho: number, alto: number): void {
    this._alto = alto;
    this._ancho = ancho;
    this.changeProyectionMat()
  }

  public get nearClip(): number {
    return this._nearClip;
  }

  public set nearClip(value: number) {
    this._nearClip = value;
    this.changeProyectionMat();
  }

  public get farClip(): number {
    return this._farClip;
  }

  public set farClip(value: number) {
    this._farClip = value;
    this.changeProyectionMat();
  }

  public get anguloVision(): number {
    return this._anguloVision;
  }

  public set anguloVision(value: number) {
    this._anguloVision = value * Math.PI / 180;
    this.changeProyectionMat();
  }

  public get proyectionMatrix(): Matrix4x4 {
    return this._projMat;
  }

  public get viewMatrix(): Matrix4x4 {
    const m = Matrix4x4.inverse(this.worldMatrix);
    return m;
  }

  public getMatricesViewProj(): ViewProj {
    return { view: this.viewMatrix, proj: this.proyectionMatrix };
  }

  public changeProyectionMat(): Matrix4x4 {
    if (this.isOrtho) {
      this._projMat = Matrix4x4.ortographic(0, this._alto, this._ancho, 0, this._nearClip, this._farClip);
      return;
    }
    this._projMat = Matrix4x4.perspective(
      this._ancho / this._alto,
      this._anguloVision,
      this._nearClip,
      this._farClip,
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
