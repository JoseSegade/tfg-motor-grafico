import Vector2 from "./vector2";


/**
* Represents a 3 parameter vector(x, y, z).
* */
export default class Vector3 {

    private _x: number;
    private _y: number;
    private _z: number;

    /**
     * Creates a new vector 3
     * @param x
     * @param y
     * @param z
     */
    public constructor(x: number = 0, y: number = 0, z: number = 0) {
        this._x = x;
        this._y = y;
        this._z = z;
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

    public set(x?: number, y?: number, z?: number): void {
        if (x !== undefined) {
            this._x = x;
        }
        if (y !== undefined) {
            this._y = y;
        }
        if (z !== undefined) {
            this._z = z;
        }
    }

    /**
     * Check if this vector is equal to the one passed in.
     * @param v The vector to check against.
     */
    public equals(v: Vector3): boolean {
        return (this._x === v._x && this._y === v._y && this._z === v._z);
    }

    public toArray(): number[] {
        return [this._x, this._y, this._z];
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }

    /**
     * Adds a vector to this.
     * @param a Vector to add to this.
     */
    public add(a: Vector3): Vector3 {
        this._x += a._x;
        this._y += a._y;
        this._z += a._z;
        return this;
    }

    /**
     * Subtracts a vector to this.
     * @param a Vector to subtract to this.
     */
    public sub(a: Vector3): Vector3 {
        this._x -= a._x;
        this._y -= a._y;
        this._z -= a._z;
        return this;
    }

    /**
     * Multiplies (dot product) a vector to this.
     * @param a Vector to multiply to this.
     */
    public dot(a: Vector3): Vector3 {
        this._x *= a._x;
        this._y *= a._y;
        this._z *= a._z;
        return this;
    }
    
    /**
     * Calculates the cross product between this vector and another vector a.
     * @param a Vector to cross by.
     */
    public cross(a: Vector3): Vector3 {
        const vec = new Vector3((this._y*a._z - this._z*a._y), (this._x*a._z - this._z*a._x), (this._x*a._y - this._y*a._x));
        this.copyFrom(vec);
        return this;
    }

    /**
     * Multiplies the vector by a factor of scale
     * @param factor 
     */
    public scale(factor: number): Vector3 {
        this._x *= factor;
        this._y *= factor;
        this._z *= factor;

        return this;
    }

    /**
     * Divides a vector to this.
     * @param a Vector to divide to this.
     */
    public div(a: Vector3): Vector3 {
        this._x /= a._x;
        this._y /= a._y;
        this._z /= a._z;
        return this;
    }

    /**
     * Adds vector a to vector b.
     * @param a First vector to add.
     * @param b Second vector to add.
     */
    public static add(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a._x + b._x, a._y + b._y, a._z + b._z);
    }

    /**
     * Subtracts vector b to vector a.
     * @param a Vector to be substracted.
     * @param b Vector substract.
     */
    public static sub(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a._x - b._x, a._y - b._y, a._z - b._z);
    }

    /**
     * Calculates dot product of vector a by vector b.
     * @param a First vector to multiply.
     * @param b Second vector to multiply.
     */
    public static dot(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a._x * b._x, a._y * b._y, a._z * b._z);
    }

    /**
     * Calculates division between a vector a and vector b.
     * @param a Vector to be divided.
     * @param b vector to divide by.
     */
    public static div(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a._x / b._x, a._y / b._y, a._z / b._z);
    }

    /**
     * Calculates the cross product between a vector a and vector b.
     * @param a First vector to cross by.
     * @param b Second vector to cross by.
     */
    public static cross(a: Vector3, b: Vector3) {
        return new Vector3((a._y*b._z - a._z*b._y), (a._x*b._z - a._z*b._x), (a._x*b._y - a._y*b._x));
    }

    public static distance(a: Vector3, b: Vector3): number {
        const diff = Vector3.sub(a, b);
        return Math.sqrt(diff._x * diff._x + diff._y * diff._y + diff._z * diff._z);
    }

    /**
     * Multiplies the vector by a factor of scale
     * @param factor 
     */
    public static scale(vector: Vector3, factor: number): Vector3 {
        const ret = Vector3.zero;
        ret._x = vector._x * factor;
        ret._y = vector._y * factor;
        ret._z = vector._z * factor;
        return ret;
    }

    public static normalize(vector: Vector3): Vector3 {        
        return Vector3.zero.copyFrom(this.scale(vector, vector.length));
    }

    /**
     * Returns the sum of each component of this vector.
     * */
    public sum(): number {
        return this._x + this._y + this._z;
    }

    public get length(): number {
        return Math.sqrt(this._x*this._x + this._y*this._y + this._z*this._z);
    }

    public copyFrom(vector: Vector3): Vector3 {
        this._x = vector._x;
        this._y = vector._y;
        this._z = vector._z;
        return this;
    }

    /**
     * Returns a new vector with the same components.
     * */
    public clone(): Vector3 {
        return new Vector3(this._x, this._y, this._z);
    }

    public get xy(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    public get xz(): Vector2 {
        return new Vector2(this.x, this.z);
    }

    public get yx(): Vector2 {
        return new Vector2(this.y, this.x);
    }

    public get yz(): Vector2 {
        return new Vector2(this.y, this.z);
    }

    public get zx(): Vector2 {
        return new Vector2(this.z, this.x);
    }

    public get zy(): Vector2 {
        return new Vector2(this.z, this.y);
    }

    public static get zero(): Vector3 {
        return new Vector3();
    }

    public static get one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    public static get up(): Vector3{
        return new Vector3(0.0, 1.0, 0.0);
    }

    public static get forward(): Vector3{
        return new Vector3(0.0, 0.0, 1.0);
    }

    /**
     * Converts json data into numbers x, y, z.
     * @param json Json data.
     */
    public setFromJson(json: any): Vector3 {
        this.x = 0;
        this.y = 0;
        this.z = 0;
        if (json.x !== undefined) {
            this._x = Number(json.x);
        }
        if (json.y !== undefined) {
            this._y = Number(json.y);
        }
        if (json.z !== undefined) {
            this._z = Number(json.z);
        }

        return this;
    }
}