import Vector3 from "./vector3";
import Matrix4x4 from "./matrix4x4";
import Quaternion from "./quaternion";

/**
 * This class manage the position, rotation and scale of an object.
 * */
export default class Transform {

    public position: Vector3 = Vector3.zero;
    public rotation: Quaternion = Quaternion.identity;
    public scale: Vector3 = Vector3.one;

    /**
     * Makes a copy inside this transform from antother transform.
     * @param transform Transform to copy from.
     */
    public copyFrom(transform: Transform): void {
        this.position.copyFrom(transform.position);
        this.rotation.copyFrom(transform.rotation);
        this.scale.copyFrom(transform.scale);
    }

    /**
     * Makes a transformation matrix with all the parameters needed.
     * */
    public getTransformationMatrix(): Matrix4x4 {
        const tra = Matrix4x4.translation(this.position);
        const rot = Quaternion.toMatrix4x4(this.rotation);
        const sca = Matrix4x4.scale(this.scale);

        //  position x rotation x scale
        return Matrix4x4.multiply(Matrix4x4.multiply(tra, rot), sca);
    }

    /**
     * Converts json data in this type of transform for each one of the fields (postion, rotation, scale).
     * @param json Json data.
     */
    public setFromJson(json: any): void {
        if (json.position !== undefined) {
            this.position.setFromJson(json.position);
        }
        if (json.rotation !== undefined) {
            this.rotation.setFromJson(json.rotation);
        }
        if (json.scale !== undefined) {
            this.scale.setFromJson(json.scale);
        }
    }
}
