import Vector3 from "./vector3";
import Vector4 from "./vector4";

export default class Matrix4x4 {

    private _data: number[] = [];

    private constructor() {
        this._data = [
            //  Identity matrix
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0
        ];
    }

    public get data(): number[] {
        return this._data;
    }

    public static get identity(): Matrix4x4 {
        return new Matrix4x4();
    }

    public static ortographic(left: number, right: number, bottom: number, top: number, nearClip: number, farClip: number): Matrix4x4 {
        const m: Matrix4x4 = new Matrix4x4();

        const lr: number = 1.0 / (left - right);
        const bt: number = 1.0 / (bottom - top);
        const nf: number = 1.0 / (nearClip - farClip);

        m._data[0] = -2.0 * lr;
        m._data[5] = -2.0 * bt;
        m._data[10] = 2.0 * nf;

        m._data[12] = (left + right) * lr;
        m._data[13] = (top + bottom) * bt;
        m._data[14] = (farClip + nearClip) * nf;

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

    public static rotationX(angleInRadians: number): Matrix4x4 {
        const m = new Matrix4x4();

        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        m._data[5] = c;
        m._data[6] = -s;
        m._data[9] = s;
        m._data[10] = c;

        return m;
    }

    public static rotationY(angleInRadians: number): Matrix4x4 {
        const m = new Matrix4x4();

        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        m._data[0] = c;
        m._data[2] = s;
        m._data[8] = -s;
        m._data[10] = c;

        return m;
    }

    public static rotationZ(angleInRadians: number): Matrix4x4 {
        const m = new Matrix4x4();

        const c = Math.cos(angleInRadians);
        const s = Math.sin(angleInRadians);

        m._data[0] = c;
        m._data[1] = -s;
        m._data[4] = s;
        m._data[5] = c;

        return m;
    }

    /**
     * Makes the calculation of a matrix rotated the specified angles (in radians).
     * @param xRadians Radians to rotate in X axe.
     * @param yRadians Radians to rotate in Y axe.
     * @param zRadians Radians to rotate in Z axe.
     */
    public static rotationXYZRadians(xRadians: number, yRadians: number, zRadians: number): Matrix4x4 {
        const rx = Matrix4x4.rotationX(xRadians);
        const ry = Matrix4x4.rotationY(yRadians);
        const rz = Matrix4x4.rotationZ(zRadians);
        return Matrix4x4.multiply(Matrix4x4.multiply(rz, ry), rx);
    }

    /**
     * Calculates rotation of a matrix rotated the specified angles (in radians)
     * @param rotation Vector with rotation values.
     */
    public static rotationXYZ(rotation: Vector3): Matrix4x4 {
        return Matrix4x4.rotationXYZRadians(rotation.x, rotation.y, rotation.z);
    }

    public static scale(scale: Vector3): Matrix4x4 {
        const m = new Matrix4x4;
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

        const aVectors: Vector4[] = Vector4.subdivideMatrix4x4(Matrix4x4.transpose(a));
        const bVectors: Vector4[] = Vector4.subdivideMatrix4x4(b);

        m._data.forEach((_, index, arr) => {
            const vectorA: Vector4 = aVectors[(index % 4)];
            const vectorB: Vector4 = bVectors[Math.floor(index / 4)];
            arr[index] = Vector4.dot(vectorA, vectorB).sum();
        });

        return m;
    }

    /**
     * Returns transposed matrix. Changes row values for column values.
     * @param a Matrix to inverse.
     */
    public static transpose(a: Matrix4x4): Matrix4x4 {
        const m = new Matrix4x4();
        a._data.forEach((val, index) => {
            const indexTransposed = (index % 4) * 4 + (Math.floor(index / 4));
            m._data[indexTransposed] = val;
        })
        return m;
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
    public printInConsole(fixedDecimals: number = 3): void {
        console.log(this._data.reduce((prev, current, idx): string => {
            if ((idx % 4 === 0)) {
                prev += `[${current.toFixed(fixedDecimals)}, `;
            }
            else if (idx % 4 === 3) {
                prev += `${current.toFixed(fixedDecimals)}]${idx == 15 ? '\n' : ',\n'}`;
            }
            else {
                prev += `${current.toFixed(fixedDecimals)}, `;
            }
            return prev;
        }, ''));
    }
}