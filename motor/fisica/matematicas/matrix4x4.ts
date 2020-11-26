import Vector3 from './vector3';
import Vector4 from './vector4';

/**
 * Defines a matrix system, column based.
 */
export default class Matrix4x4 {
  private _data: number[] = [];

  private constructor() {
    this._data = [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0];
  }

  public get data(): number[] {
    return this._data;
  }

  public static get identity(): Matrix4x4 {
    return new Matrix4x4();
  }

  public static ortographic(
    left: number,
    right: number,
    bottom: number,
    top: number,
    nearClip: number,
    farClip: number,
  ): Matrix4x4 {
    const m: Matrix4x4 = new Matrix4x4();

    const rl: number = right - left;
    const tb: number = top - bottom;
    const fn: number = farClip - nearClip;

    m._data[0] = 2.0 / rl;
    m._data[5] = 2.0 / tb;
    m._data[10] = -2.0 / fn;

    m._data[12] = -(right + left) / rl;
    m._data[13] = -(top + bottom) / tb;
    m._data[14] = -(farClip + nearClip) / fn;

    return m;
  }

  public static perspective(
    aspectRatio: number,
    fieldOfView: number,
    nearClip: number,
    farClip: number,
  ): Matrix4x4 {
    const m: Matrix4x4 = new Matrix4x4();

    const f = 1.0 / Math.tan(fieldOfView / 2);

    m._data[0] = f / aspectRatio;
    m._data[5] = f;
    m._data[10] = -(farClip + nearClip) / (farClip - nearClip);
    m._data[11] = -1.0;
    m._data[14] = -(2.0 * farClip * nearClip) / (farClip - nearClip);
    m._data[15] = 0.0;
    return m;
  }

  /**
   * Creates a transformation matrix using the provided position.
   * @param position The position to be used in transformation.
   */
  public static translation(position: Vector3): Matrix4x4 {
    const m: Matrix4x4 = new Matrix4x4();

    m._data[12] = position.x;
    m._data[13] = position.y;
    m._data[14] = position.z;

    return m;
  }

  public static rotationX(radians: number): Matrix4x4 {
    const m = new Matrix4x4();

    const c = Math.cos(radians);
    const s = Math.sin(radians);

    m._data[5] = c;
    m._data[6] = s;
    m._data[9] = -s;
    m._data[10] = c;

    return m;
  }

  public static rotationY(radians: number): Matrix4x4 {
    const m = new Matrix4x4();

    const c = Math.cos(radians);
    const s = Math.sin(radians);

    m._data[0] = c;
    m._data[2] = -s;
    m._data[8] = s;
    m._data[10] = c;

    return m;
  }

  public static rotationZ(radians: number): Matrix4x4 {
    const m = new Matrix4x4();

    const c = Math.cos(radians);
    const s = Math.sin(radians);

    m._data[0] = c;
    m._data[1] = s;
    m._data[4] = -s;
    m._data[5] = c;

    return m;
  }

  /**
   * Makes the calculation of a matrix rotated the specified angles (in radians).
   * @param xRadians Radians to rotate in X axe.
   * @param yRadians Radians to rotate in Y axe.
   * @param zRadians Radians to rotate in Z axe.
   */
  public static rotationXYZRadians(
    xRadians: number,
    yRadians: number,
    zRadians: number,
  ): Matrix4x4 {
    const rx = Matrix4x4.rotationX(xRadians);
    const ry = Matrix4x4.rotationY(yRadians);
    const rz = Matrix4x4.rotationZ(zRadians);
    return Matrix4x4.multiply(Matrix4x4.multiply(rz, ry), rx);
  }

  /**
   * Calculates rotation of a matrix rotated the specified angles (in degrees)
   * @param rotation Vector with rotation values.
   */
  public static rotationXYZ(rotation: Vector3): Matrix4x4 {
    return Matrix4x4.rotationXYZRadians(
      (rotation.x * Math.PI) / 180,
      (rotation.y * Math.PI) / 180,
      (rotation.z * Math.PI) / 180,
    );
  }

  public static scale(scale: Vector3): Matrix4x4 {
    const m = new Matrix4x4();
    m._data[0] = scale.x;
    m._data[5] = scale.y;
    m._data[10] = scale.z;
    return m;
  }

  /**
   * Multiplies matrix a and matrix b.
   * @param a First matrix to multiply.
   * @param b Second matrix to multiply.
   */
  public static multiply(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
    const m = new Matrix4x4();

    const aVectors: Vector4[] = this.subdivideMatrix4x4(Matrix4x4.transpose(a));
    const bVectors: Vector4[] = this.subdivideMatrix4x4(b);

    m._data.forEach((_, index, arr) => {
      const vectorA: Vector4 = aVectors[index % 4];
      const vectorB: Vector4 = bVectors[Math.floor(index / 4)];
      arr[index] = Vector4.dot(vectorA, vectorB).sum();
    });

    return m;
  }

  public static lookAt(eye: Vector3, at: Vector3, up: Vector3): Matrix4x4 {
    const zAxis = Vector3.normalize(Vector3.sub(at, eye));
    const xAxis = Vector3.normalize(Vector3.cross(zAxis, up));
    const yAxis = Vector3.cross(xAxis, zAxis);

    zAxis.scale(-1);

    const or = this.setMatrix4x4WithVector4([
      new Vector4(xAxis.x, yAxis.x, zAxis.x, 0),
      new Vector4(xAxis.y, yAxis.y, zAxis.y, 0),
      new Vector4(xAxis.z, yAxis.z, zAxis.z, 0),
      new Vector4(
        -1 * Vector3.dot(xAxis, eye).sum(),
        -1 * Vector3.dot(yAxis, eye).sum(),
        -1 * Vector3.dot(zAxis, eye).sum(),
        1,
      ),
    ]);

    return or;
  }

  public static setMatrix4x4WithVector4(vectorList: Vector4[]): Matrix4x4 {
    const m = new Matrix4x4();

    vectorList.forEach((vec4, idx): void => {
      m._data[idx * 4 + 0] = vec4.x;
      m._data[idx * 4 + 1] = vec4.y;
      m._data[idx * 4 + 2] = vec4.z;
      m._data[idx * 4 + 3] = vec4.w;
    });

    return m;
  }

  /**
   * Subdivides the provided matrix in an array of four vectors.
   * @param matrix Matrix to subdivide.
   */
  public static subdivideMatrix4x4(matrix: Matrix4x4): Vector4[] {
    const array: Vector4[] = [];

    for (let i = 0; i < 4; ++i) {
      array[i] = new Vector4(
        matrix.data[i * 4 + 0],
        matrix.data[i * 4 + 1],
        matrix.data[i * 4 + 2],
        matrix.data[i * 4 + 3],
      );
    }

    return array;
  }

  /**
   * Returns transposed matrix. Changes row values for column values.
   * @param a Matrix to inverse.
   */
  public static transpose(a: Matrix4x4): Matrix4x4 {
    const m = new Matrix4x4();
    a._data.forEach((val, index) => {
      const indexTransposed = (index % 4) * 4 + Math.floor(index / 4);
      m._data[indexTransposed] = val;
    });
    return m;
  }

  public static inverse(m: Matrix4x4): Matrix4x4 {
    /**
    *
    *  Autor original: https://stackoverflow.com/questions/1148309/inverting-a-4x4-matrix
    * 
    **/

    const ret = Matrix4x4.identity;
    const inv = [];

    inv[0] =
      m._data[5] * m._data[10] * m._data[15] -
      m._data[5] * m._data[11] * m._data[14] -
      m._data[9] * m._data[6] * m._data[15] +
      m._data[9] * m._data[7] * m._data[14] +
      m._data[13] * m._data[6] * m._data[11] -
      m._data[13] * m._data[7] * m._data[10];

    inv[4] =
      -m._data[4] * m._data[10] * m._data[15] +
      m._data[4] * m._data[11] * m._data[14] +
      m._data[8] * m._data[6] * m._data[15] -
      m._data[8] * m._data[7] * m._data[14] -
      m._data[12] * m._data[6] * m._data[11] +
      m._data[12] * m._data[7] * m._data[10];

    inv[8] =
      m._data[4] * m._data[9] * m._data[15] -
      m._data[4] * m._data[11] * m._data[13] -
      m._data[8] * m._data[5] * m._data[15] +
      m._data[8] * m._data[7] * m._data[13] +
      m._data[12] * m._data[5] * m._data[11] -
      m._data[12] * m._data[7] * m._data[9];

    inv[12] =
      -m._data[4] * m._data[9] * m._data[14] +
      m._data[4] * m._data[10] * m._data[13] +
      m._data[8] * m._data[5] * m._data[14] -
      m._data[8] * m._data[6] * m._data[13] -
      m._data[12] * m._data[5] * m._data[10] +
      m._data[12] * m._data[6] * m._data[9];

    inv[1] =
      -m._data[1] * m._data[10] * m._data[15] +
      m._data[1] * m._data[11] * m._data[14] +
      m._data[9] * m._data[2] * m._data[15] -
      m._data[9] * m._data[3] * m._data[14] -
      m._data[13] * m._data[2] * m._data[11] +
      m._data[13] * m._data[3] * m._data[10];

    inv[5] =
      m._data[0] * m._data[10] * m._data[15] -
      m._data[0] * m._data[11] * m._data[14] -
      m._data[8] * m._data[2] * m._data[15] +
      m._data[8] * m._data[3] * m._data[14] +
      m._data[12] * m._data[2] * m._data[11] -
      m._data[12] * m._data[3] * m._data[10];

    inv[9] =
      -m._data[0] * m._data[9] * m._data[15] +
      m._data[0] * m._data[11] * m._data[13] +
      m._data[8] * m._data[1] * m._data[15] -
      m._data[8] * m._data[3] * m._data[13] -
      m._data[12] * m._data[1] * m._data[11] +
      m._data[12] * m._data[3] * m._data[9];

    inv[13] =
      m._data[0] * m._data[9] * m._data[14] -
      m._data[0] * m._data[10] * m._data[13] -
      m._data[8] * m._data[1] * m._data[14] +
      m._data[8] * m._data[2] * m._data[13] +
      m._data[12] * m._data[1] * m._data[10] -
      m._data[12] * m._data[2] * m._data[9];

    inv[2] =
      m._data[1] * m._data[6] * m._data[15] -
      m._data[1] * m._data[7] * m._data[14] -
      m._data[5] * m._data[2] * m._data[15] +
      m._data[5] * m._data[3] * m._data[14] +
      m._data[13] * m._data[2] * m._data[7] -
      m._data[13] * m._data[3] * m._data[6];

    inv[6] =
      -m._data[0] * m._data[6] * m._data[15] +
      m._data[0] * m._data[7] * m._data[14] +
      m._data[4] * m._data[2] * m._data[15] -
      m._data[4] * m._data[3] * m._data[14] -
      m._data[12] * m._data[2] * m._data[7] +
      m._data[12] * m._data[3] * m._data[6];

    inv[10] =
      m._data[0] * m._data[5] * m._data[15] -
      m._data[0] * m._data[7] * m._data[13] -
      m._data[4] * m._data[1] * m._data[15] +
      m._data[4] * m._data[3] * m._data[13] +
      m._data[12] * m._data[1] * m._data[7] -
      m._data[12] * m._data[3] * m._data[5];

    inv[14] =
      -m._data[0] * m._data[5] * m._data[14] +
      m._data[0] * m._data[6] * m._data[13] +
      m._data[4] * m._data[1] * m._data[14] -
      m._data[4] * m._data[2] * m._data[13] -
      m._data[12] * m._data[1] * m._data[6] +
      m._data[12] * m._data[2] * m._data[5];

    inv[3] =
      -m._data[1] * m._data[6] * m._data[11] +
      m._data[1] * m._data[7] * m._data[10] +
      m._data[5] * m._data[2] * m._data[11] -
      m._data[5] * m._data[3] * m._data[10] -
      m._data[9] * m._data[2] * m._data[7] +
      m._data[9] * m._data[3] * m._data[6];

    inv[7] =
      m._data[0] * m._data[6] * m._data[11] -
      m._data[0] * m._data[7] * m._data[10] -
      m._data[4] * m._data[2] * m._data[11] +
      m._data[4] * m._data[3] * m._data[10] +
      m._data[8] * m._data[2] * m._data[7] -
      m._data[8] * m._data[3] * m._data[6];

    inv[11] =
      -m._data[0] * m._data[5] * m._data[11] +
      m._data[0] * m._data[7] * m._data[9] +
      m._data[4] * m._data[1] * m._data[11] -
      m._data[4] * m._data[3] * m._data[9] -
      m._data[8] * m._data[1] * m._data[7] +
      m._data[8] * m._data[3] * m._data[5];

    inv[15] =
      m._data[0] * m._data[5] * m._data[10] -
      m._data[0] * m._data[6] * m._data[9] -
      m._data[4] * m._data[1] * m._data[10] +
      m._data[4] * m._data[2] * m._data[9] +
      m._data[8] * m._data[1] * m._data[6] -
      m._data[8] * m._data[2] * m._data[5];

    let det;
    det = m._data[0] * inv[0] + m._data[1] * inv[4] + m._data[2] * inv[8] + m._data[3] * inv[12];

    if (det === 0) return ret;

    det = 1.0 / det;

    inv.forEach((e, idx) => {
      ret._data[idx] = e * det;
    });

    return ret;
  }

  public get(row: number, col: number): number {
    return this._data[col + 4 * row];
  }

  /**
   * Copies the data of the provided matrix inside this matrix's data.
   * @param m Matrix to copy from.
   */
  public copyFrom(m: Matrix4x4): void {
    this._data.forEach((_, index, arr) => {
      arr[index] = m._data[index];
    });
  }

  public traslate(vec: Vector3): Matrix4x4 {
    this._data[12] += vec.x;
    this._data[13] += vec.y;
    this._data[14] += vec.z;

    return this;
  }

  public rotate(rot: Vector3): Matrix4x4 {
    const other = Matrix4x4.rotationXYZ(rot);
    this.copyFrom(Matrix4x4.multiply(this, other));
    return this;
  }

  /**
   * Provides this matrix's data as a Float32Array.
   * */
  public toFloat32Array(): Float32Array {
    return new Float32Array(this._data);
  }

  /**
   * Makes a pretty print of the matrix.
   * @param fixedDecimals specifies decimals to be printed in console. Default = 3.
   */
  public printInConsole(fixedDecimals = 3): void {
    console.log(
      this._data.reduce((prev, current, idx): string => {
        if (idx % 4 === 0) {
          prev += `[${current.toFixed(fixedDecimals)}, `;
        } else if (idx % 4 === 3) {
          prev += `${current.toFixed(fixedDecimals)}]${idx == 15 ? '\n' : ',\n'}`;
        } else {
          prev += `${current.toFixed(fixedDecimals)}, `;
        }
        return prev;
      }, ''),
    );
  }
}
