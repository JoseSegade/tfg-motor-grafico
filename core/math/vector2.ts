import Vector3 from "./vector3";

/**
 * Represents a 2 parameter vector (x, y).
 * */
export default class Vector2 {

    private _x: number;
    private _y: number;

    /**
     * Creates a new vector 2
     * @param x
     * @param y
     */
    public constructor(x: number = 0, y: number = 0) {
        this._x = x;
        this._y = y;
    }

    /**
     * X param.
     **/
    public get x(): number {
        return this._x;
    }

    /**
     * Sets X param.
     **/
    public set x(value: number) {
        this._x = value;
    }

    /**
     * Y param.
     **/
    public get y(): number {
        return this._y;
    }

    /**
     * Sets Y param.
     **/
    public set y(value: number) {
        this._y = value;
    }

    public set(x?: number, y?: number): void {
        if (x !== undefined) {
            this._x = x;
        }
        if (y !== undefined) {
            this._y = y;
        }
    }

    public toArray(): number[] {
        return [this._x, this._y];
    }

    public toFloat32Array(): Float32Array {
        return new Float32Array(this.toArray());
    }

    /**
     * Adds a vector to this.
     * @param a Vector to add to this.
     */
    public add(a: Vector2): Vector2 {
        this._x += a._x;
        this._y += a._y;
        return this;
    }

    /**
     * Subtracts a vector to this.
     * @param a Vector to subtract to this.
     */
    public sub(a: Vector2): Vector2 {
        this._x -= a._x;
        this._y -= a._y;
        return this;
    }

    /**
     * Multiplies (dot product) a vector to this.
     * @param a Vector to multiply to this.
     */
    public dot(a: Vector2): Vector2 {
        this._x *= a._x;
        this._y *= a._y;
        return this;
    }

    public scale(factor: number): Vector2 {
        this._x *= factor;
        this._y *= factor;

        return this;
    }

    /**
     * Divides a vector to this.
     * @param a Vector to divide to this.
     */
    public div(a: Vector2): Vector2 {
        this._x /= a._x;
        this._y /= a._y;
        return this;
    }

    /**
     * Adds vector a to vector b.
     * @param a First vector to add.
     * @param b Second vector to add.
     */
    public static add(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a._x + b._x, a._y + b._y);
    }

    /**
     * Substracts vector b to vector a.
     * @param a Vector to be substracted.
     * @param b Vector substract.
     */
    public static sub(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a._x - b._x, a._y - b._y);
    }

    /**
     * Calculates dot product of vector a by vector b.
     * @param a First vector to multiply.
     * @param b Second vector to multiply.
     */
    public static dot(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a._x * b._x, a._y * b._y);
    }

    /**
     * Calculates division between a vector a and vector b.
     * @param a Vector to be divided.
     * @param b vector to divide by.
     * */
    public static div(a: Vector2, b: Vector2): Vector2 {
        return new Vector2(a._x / b._x, a._y / b._y);
    }

    /**
     * Returns the sum of each component of this vector.
     * */
    public sum(): number {
        return this._x + this._y;
    }

    public static distance(a: Vector2, b: Vector2): number {
        const diff = Vector2.sub(a, b);
        return Math.sqrt(diff._x * diff._x + diff._y * diff._y);
    }

    public copyFrom(vector: Vector2): void {
        this._x = vector._x;
        this._y = vector._y;
    }

    public toVector3(): Vector3 {
        return new Vector3(this._x, this._y, 0);
    }

    public static get zero() {
        return new Vector2();
    }

    public static get one() {
        return new Vector2(1.0, 1.0);
    }

    /**
     * Returns a new vector with the same components.
     * */
    public clone(): Vector2 {
        return new Vector2(this._x, this._y);
    }

    /**
     * Converts json data into numbers for each field (x, y).
     * @param json Json data.
     */
    public setFromJson(json: any): void {
        if (json.x !== undefined) {
            this._x = Number(json.x);
        }
        if (json.y !== undefined) {
            this._y = Number(json.y);
        }
    }

}