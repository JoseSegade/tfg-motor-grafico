import Matrix4x4 from './matrix4x4';
import Vector3 from './vector3';
import Vector4 from './vector4';

/**
 * Represents a quaternion (a rotation along an axis)
 */
export default class Quaternion {
  private _w: number;
  private _x: number;
  private _y: number;
  private _z: number;

  /**
   * Creates a new quaternion.
   * @param n Vector in which it is rotated.
   * @param radians Rotation in radians.
   */
  public constructor(n: Vector3, radians: number) {
    this._w = Math.cos(radians / 2);

    const nN = Vector3.normalize(n);

    this._x = nN.x * Math.sin(radians / 2);
    this._y = nN.y * Math.sin(radians / 2);
    this._z = nN.z * Math.sin(radians / 2);
  }

  /**
   * Quaternion identity (rotated 0 rads, looking at forward).
   */
  public static get identity(): Quaternion {
    return new Quaternion(Vector3.forward, 0);
  }

  private get xyz(): Vector3 {
    return new Vector3(this._x, this._y, this._z);
  }

  private set xyz(vec: Vector3) {
    this._x = vec.x;
    this._y = vec.y;
    this._z = vec.z;
  }

  public adjust(): Quaternion {
    if (Math.abs(this._x - 0) < 0.00001) {
      this._x = 0;
    }
    if (Math.abs(this._y - 0) < 0.00001) {
      this._y = 0;
    }
    if (Math.abs(this._z - 0) < 0.00001) {
      this._z = 0;
    }
    if (Math.abs(this._w - 0) < 0.00001) {
      this._w = 0;
    }
    return this;
  }

  /**
   * Gets the inverse rotation.
   */
  public getInverse(): Quaternion {
    const q_i = Quaternion.identity;
    q_i._w = this._w;
    q_i.xyz = this.xyz.scale(-1);
    return q_i.adjust();
  }

  /**
   * Multiplicates this quaternion by the passed one. Be aware that the multiplication does not have
   * commutative properties.
   * @param q Quaternion to multiply by.
   */
  public multiply(q: Quaternion): Quaternion {
    const ret = Quaternion.identity;

    ret._w = this._w * q._w - this._x * q._x - this._y * q._y - this._z * q._z;
    ret._x = this._w * q._x + this._x * q._w - this._y * q._z + this._z * q._y;
    ret._y = this._w * q._y + this._x * q._z + this._y * q._w - this._z * q._x;
    ret._z = this._w * q._z - this._x * q._y + this._y * q._x + this._z * q._w;

    this.copyFrom(ret);

    return this.adjust();
  }

  /**
   * Normalizes the lenght.
   */
  public normalize(): Quaternion {
    const d = new Vector4(this._w, this._x, this._y, this._z).length;
    this._w /= d;
    this._x /= d;
    this._y /= d;
    this._z /= d;
    return this.adjust();
  }

  /**
   * Transforms a quaternion into a 4x4 matrix (rotation matrix).
   * @param q Quaternion to transform.
   */
  public static toMatrix4x4(q: Quaternion): Matrix4x4 {
    const ret = Matrix4x4.identity;
    ret.data[0] = 1.0 - 2.0 * (q._y * q._y + q._z * q._z);
    ret.data[1] = 2 * (q._x * q._y + q._z * q._w);
    ret.data[2] = 2 * (q._x * q._z - q._y * q._w);

    ret.data[4] = 2 * (q._x * q._y - q._z * q._w);
    ret.data[5] = 1.0 - 2.0 * (q._x * q._x + q._z * q._z);
    ret.data[6] = 2 * (q._y * q._z + q._x * q._w);

    ret.data[8] = 2 * (q._x * q._z + q._y * q._w);
    ret.data[9] = 2 * (q._y * q._z - q._x * q._w);
    ret.data[10] = 1 - 2 * (q._x * q._x + q._y * q._y);

    return ret;
  }

  /**
   * Transforms a 4x4 matrix (rotation matrix) intro a quaternion.
   * @param mat Rotation matrix.
   */
  public static matrix4x4toQuaternion(mat: Matrix4x4): Quaternion {
    const ret = Quaternion.identity;
    const lengths = [
      Math.sqrt((1 + mat.get(0, 0) + mat.get(1, 1) + mat.get(2, 2)) / 4),
      Math.sqrt((1 + mat.get(0, 0) - mat.get(1, 1) - mat.get(2, 2)) / 4),
      Math.sqrt((1 - mat.get(0, 0) + mat.get(1, 1) - mat.get(2, 2)) / 4),
      Math.sqrt((1 - mat.get(0, 0) - mat.get(1, 1) + mat.get(2, 2)) / 4),
    ];
    
    let idx = 0;
    for (let i = 1; i < 4; i++) {
      if (lengths[i] > lengths[0]) {
        idx = i;
      }
    }   

    switch (idx) {
      case 0:
        ret._w = lengths[0];
        ret._x = (mat.get(1,2)-mat.get(2,1))/(4*ret._w);
        ret._y = (mat.get(2,0)-mat.get(0,2))/(4*ret._w);
        ret._z = (mat.get(0,1)-mat.get(1,0))/(4*ret._w);
        break;
      case 1:
        ret._x = lengths[0];
        ret._w = (mat.get(1,2)-mat.get(2,1))/(4*ret._x);
        ret._y = (mat.get(1,0)+mat.get(0,1))/(4*ret._x);
        ret._z = (mat.get(2,0)+mat.get(0,2))/(4*ret._x);
        break;
      case 2:
        ret._y = lengths[0];
        ret._w = (mat.get(2,0)-mat.get(0,2))/(4*ret._y);
        ret._x = (mat.get(1,0)+mat.get(0,1))/(4*ret._y);
        ret._z = (mat.get(2,1)+mat.get(1,2))/(4*ret._y);
        break;
      case 3:
        ret._z = lengths[0];
        ret._w = (mat.get(0,1)-mat.get(1,0))/(4*ret._z);
        ret._x = (mat.get(2,0)+mat.get(0,2))/(4*ret._z);
        ret._y = (mat.get(2,1)+mat.get(1,2))/(4*ret._z);
        break;
    }

    return ret;
  }

  /**
   * Transform a vector into a quaternion.
   * @param eulerAngles Angles in degrees.
   */
  public static eulerAnglesToQuaternion(eulerAngles: Vector3): Quaternion {
    const ret = Quaternion.identity;

    const yaw = (eulerAngles.z * Math.PI) / 180.0;
    const pitch = (eulerAngles.y * Math.PI) / 180.0;
    const roll = (eulerAngles.x * Math.PI) / 180.0;

    const cy = Math.cos(yaw * 0.5);
    const sy = Math.sin(yaw * 0.5);
    const cp = Math.cos(pitch * 0.5);
    const sp = Math.sin(pitch * 0.5);
    const cr = Math.cos(roll * 0.5);
    const sr = Math.sin(roll * 0.5);

    ret._w = cr * cp * cy + sr * sp * sy;
    ret._x = sr * cp * cy - cr * sp * sy;
    ret._y = cr * sp * cy + sr * cp * sy;
    ret._z = cr * cp * sy - sr * sp * cy;

    return ret.adjust();
  }

  /**
   * Creates a new quaternion looking towards the destination point.
   * @param sourcePoint The point to start over.
   * @param destPoint The point to look in.
   */
  public static lookAt(sourcePoint: Vector3, destPoint: Vector3): Quaternion {
    const toVector = Vector3.normalize(Vector3.sub(destPoint, sourcePoint));
    const dot = Vector3.dot(Vector3.up, toVector).sum();

    if(Math.abs(dot - (-1.0))< 0.00001) {
      return new Quaternion(Vector3.up, Math.PI);
    }
    if(Math.abs(dot - (1.0)) < 0.00001) {
      return Quaternion.identity;
    }
    
    const angle = Math.acos(dot);
    const rotAxis = Vector3.normalize(Vector3.cross(Vector3.forward, toVector));

    return new Quaternion(rotAxis, angle);
  }

  public static lookRotation(lookAt: Vector3, upDirection: Vector3) {
    const ret = Quaternion.identity;
    const forward = Vector3.normalize(lookAt);
    const up = Vector3.normalize(upDirection);
    const right = Vector3.cross(up, forward);
    
    ret._w = Math.sqrt(1.0 + right.x + up.y + forward.z) * 0.5;
    const w4_recip = 1.0 / (4.0 * ret._w);
    ret._x = (forward.y - up.z) * w4_recip;
    ret._y = (right.z - forward.x) * w4_recip;
    ret._z = (up.x - right.y) * w4_recip;
    
    return ret.getInverse();
    }

  /**
   * Transforms the quaternion into a vector 3 containing the three euler angles in degrees.
   */
  public toEulerAngles(): Vector3 {
    const ret = Vector3.zero;

    const sr_cp = 2 * (this._w * this._x + this._y * this._z);
    const cr_cp = 1 - 2 * (this._x * this._x + this._y * this._y);
    ret.x = (Math.atan2(sr_cp, cr_cp) * 180) / Math.PI;

    const sp = 2 * (this._w * this._y - this._z * this._x);
    if (Math.abs(sp) >= 1) {
      ret.y = (Math.PI / 2) * (sp < 0 ? -1 : 0);
    } else {
      ret.y = (Math.asin(sp) * 180) / Math.PI;
    }

    const sy_cp = 2 * (this._w * this._z + this._x * this._y);
    const cy_cp = 1 - 2 * (this._y * this._y + this._z * this._z);
    ret.z = (Math.atan2(sy_cp, cy_cp) * 180) / Math.PI;

    return ret;
  }

  /**
   * Rotates this quaternion the values passed into.
   * @param eulerAngles Euler angles in degrees.
   */
  public rotateEuler(eulerAngles: Vector3): Quaternion {
    const q = Quaternion.eulerAnglesToQuaternion(eulerAngles);
    return this.copyFrom(q.multiply(this)).adjust();
  }

  /**
   * Copies the coordinates from the passed quaternion in this current one.
   * @param q Quaternion to copy its coordinates from.
   */
  public copyFrom(q: Quaternion): Quaternion {
    this._w = q._w;
    this._x = q._x;
    this._y = q._y;
    this._z = q._z;
    return this;
  }

  /**
   * Creates a quaternion from data extracted from a json.
   * @param json Json data.
   */
  public setFromJson(json: any): Quaternion {
    return this.copyFrom(Quaternion.eulerAnglesToQuaternion(Vector3.zero.setFromJson(json)));
  }
}
