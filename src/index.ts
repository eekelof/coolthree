import { BufferGeometry, Color, InstancedMesh, Material, Object3D } from "three";

export class CoolThree {
    ims = new Map<string, InstancedMesh>();
    add(scene: Object3D, name: string, geo: BufferGeometry, mat: Material, amount = 1000) {
        const im = new InstancedMesh(geo, mat, amount);
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
    get(name: string): InstancedMesh | undefined {
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

            if (!(obj as CoolMesh).im)
                return;
            (obj as CoolMesh).im.setMatrixAt((obj as CoolMesh).im.count, obj.matrixWorld);
            (obj as CoolMesh).im.setColorAt((obj as CoolMesh).im.count, (obj as CoolMesh).color);
            (obj as CoolMesh).im.instanceMatrix!.needsUpdate = true;
            (obj as CoolMesh).im.instanceColor!.needsUpdate = true;
            (obj as CoolMesh).im.count++;
        });
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