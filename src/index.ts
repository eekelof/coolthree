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
    get(name: string) {
        return this.ims.get(name);
    }
    update(scene: Object3D) {
        for (const [_k, im] of this.ims) {
            im.count = 0;
        }
        CoolThree.#traverseScene(scene);
    }
    static #traverseScene(obj: Object3D) {
        if (!obj.visible)
            return;
        obj.updateMatrixWorld();
        for (const c of obj.children) {
            CoolThree.#traverseScene(c);
        }
        if (!obj.im)
            return;

        obj.im.setMatrixAt(obj.im.count, obj.matrixWorld);
        obj.im.setColorAt(obj.im.count, obj.color);
        obj.im.instanceMatrix!.needsUpdate = true;
        obj.im.instanceColor!.needsUpdate = true;
        obj.im.count++;
    }
}

export class CoolMesh extends Object3D {
    im: InstancedMesh | undefined;
    color: Color;
    constructor(im?: InstancedMesh, color = new Color(0xffffff)) {
        super();
        this.im = im;
        this.color = color;
    }
}