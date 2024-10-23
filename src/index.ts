import { BufferGeometry, Color, InstancedMesh, Material, Object3D, StreamDrawUsage } from "three";

export class CoolThree {
    ims = new Map<string, InstancedMesh>();
    add(scene: Object3D, name: string, geo: BufferGeometry, mat: Material, amount = 1000) {
        const im = new InstancedMesh(geo, mat, amount);
        im.userData.amount = amount;
        im.instanceMatrix.setUsage(StreamDrawUsage);
        im.instanceColor?.setUsage(StreamDrawUsage);
        this.ims.set(name, im);
        scene.add(im);
    }
    remove(name: string) {
        const im = this.ims.get(name);
        if (!im)
            return;
        this.ims.delete(name);
        im.parent?.remove(im);
    }
    get(name: string): InstancedMesh {
        return this.ims.get(name);
    }
    update(scene: Object3D) {
        for (const [_k, im] of this.ims) {
            im.count = 0;
        }
        scene.traverseVisible(obj => {
            obj.matrixAutoUpdate = true;
            obj.updateMatrix();
            obj.matrixAutoUpdate = false;
            obj.matrixWorldAutoUpdate = true;
            obj.updateWorldMatrix(false, false);
            obj.matrixWorldAutoUpdate = false;

            if (!obj.im)
                return;
            if (obj.im.count >= obj.im.userData.amount)
                return;
            obj.im.setMatrixAt(obj.im.count, obj.matrixWorld);
            obj.im.setColorAt(obj.im.count, obj.color);
            obj.im.count++;
        });
        for (const [_k, im] of this.ims) {
            if (im.count == 0)
                continue;
            im.instanceMatrix.needsUpdate = true;
            im.instanceColor!.needsUpdate = true;
            im.instanceMatrix.addUpdateRange(0, im.count * 16);
            im.instanceColor?.addUpdateRange(0, im.count * 3);
        }
    }
}

export class CoolMesh extends Object3D {
    im: InstancedMesh;
    color: Color;
    constructor(im: InstancedMesh, color = new Color(0xffffff)) {
        super();
        this.im = im;
        this.color = color;
    }
}