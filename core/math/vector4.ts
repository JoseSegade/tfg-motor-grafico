import Matrix4x4 from "./matrix4x4";

/**
 * Represents a 4 parameter vector (x, y, z, w).
 * */
export default class Vector4 {

    private _x: number;
    private _y: number;
    private _z: number;
    private _w: number;

    /**
     * Creates a new vector 4
     * @param x
     * @param y
     * @param z
     * @param w
     */
    public constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;
    }

    public copyFrom(vector: any): void {
        throw new Error("Method not implemented.");
    }

    public get x(): number {
        return this._x;
    }

    public set x(value: number) {
        this._x = value;
    }

    public get y(): number {
        return this._y;
    }

    public set y(value: number) {
        this._y = value;
    }

    public get z(): number {
        return this._z;
    }

    public set z(value: number) {
        this._z = value;
    }

    public get w(): number {
        return this._w;
    }

    public set w(value: number) {
        this._w = value;
    }

    public toArray(): number[] {
        return [this._x, this._y, this._z, this._w];
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }

    /**
     * Adds a vector to this.
     * @param a Vector to add to this.
     */
    public add(a: Vector4): Vector4 {
        this._x += a._x;
        this._y += a._y;
        this._z += a._z;
        this._w += a._w;
        return this;
    }

    /**
     * Subtracts a vector to this.
     * @param a Vector to subtract to this.
     */
    public sub(a: Vector4): Vector4 {
        this._x -= a._x;
        this._y -= a._y;
        this._z -= a._z;
        this._w -= a._w;
        return this;
    }

    /**
     * Multiplies (dot product) a vector to this.
     * @param a Vector to multiply to this.
     */
    public dot(a: Vector4): Vector4 {
        this._x *= a._x;
        this._y *= a._y;
        this._z *= a._z;
        this._w *= a._w;
        return this;
    }

    public scale(factor: number): Vector4 {
        this._x *= factor;
        this._y *= factor;
        this._z *= factor;
        this._w *= factor;

        return this;
    }


    /**
     * Divides a vector to this.
     * @param a Vector to divide to this.
     */
    public div(a: Vector4): Vector4 {
        this._x /= a._x;
        this._y /= a._y;
        this._z /= a._z;
        this._w /= a._w;
        return this;
    }

    /**
     * Adds vector a to vector b.
     * @param a First vector to add.
     * @param b Second vector to add.
     */
    public static add(a: Vector4, b: Vector4): Vector4 {
        return new Vector4(a._x + b._x, a._y + b._y, a._z + b._z, a._w + b._w);
    }

    /**
     * Substracts vector b to vector a.
     * @param a Vector to be substracted.
     * @param b Vector substract.
     */
    public static sub(a: Vector4, b: Vector4): Vector4 {
        return new Vector4(a._x - b._x, a._y - b._y, a._z - b._z, a._w - b._w);
    }

    /**
     * Calculates dot product of vector a by vector b.
     * @param a First vector to multiply.
     * @param b Second vector to multiply.
     */
    public static dot(a: Vector4, b: Vector4): Vector4 {
        return new Vector4(a._x * b._x, a._y * b._y, a._z * b._z, a._w * b._w);
    }

    /**
     * Calculates division between a vector a and vector b.
     * @param a Vector to be divided.
     * @param b vector to divide by.
     */
    public static div(a: Vector4, b: Vector4): Vector4 {
        return new Vector4(a._x / b._x, a._y / b._y, a._z / b._z, a._w / b._w);
    }

    /**
     * Returns the sum of each component of this vector.
     * */
    public sum(): number {
        return this._x + this._y + this._z + this._w;
    }

    /**
     * Subdivides the provided matrix in an array of four vectors.
     * @param matrix Matrix to subdivide.
     */
    public static subdivideMatrix4x4(matrix: Matrix4x4): Vector4[] {
        const array: Vector4[] = [];

        for (let i = 0; i < 4; ++i) {
            array[i] = new Vector4(matrix.data[i * 4 + 0], matrix.data[i * 4 + 1], matrix.data[i * 4 + 2], matrix.data[i * 4 + 3]);
        }

        return array;
    }

    public static get zero(): Vector4 {
        return new Vector4();
    }

    /**
     * Converts json data into numbers for each field (x, y, z, w).
     * @param json Json data.
     */
    public setFromJson(json: any): void {
        if (json.x !== undefined) {
            this._x = Number(json.x);
        }
        if (json.y !== undefined) {
            this._y = Number(json.y);
        }
        if (json.z !== undefined) {
            this._z = Number(json.z);
        }
        if (json.w !== undefined) {
            this._w = Number(json.w);
        }
    }

    /**
     * Returns a new vector with the same components.
     * */
    public clone(): Vector4 {
        return new Vector4(this._x, this._y, this._z, this._w);
    }

}