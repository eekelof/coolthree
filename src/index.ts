import { BufferGeometry, Color, InstancedMesh, Material, Object3D } from "three";

export class CoolThree {
    cims = new Map<string, CoolInstancedMesh>();
    add(scene: Object3D, name: string, geo: BufferGeometry, mat: Material, amount = 1000, isDynamic = true) {
        const cim = new CoolInstancedMesh(geo, mat, amount, isDynamic);
        this.cims.set(name, cim);
        scene.add(cim);
    }
    remove(name: string) {
        const cim = this.cims.get(name);
        if (!cim)
            return;
        this.cims.delete(name);
        cim.parent?.remove(cim);
    }
    get(name: string) {
        return this.cims.get(name);
    }
    update(scene: Object3D) {
        for (const cim of this.cims.values()) {
            if (!cim.isDynamic && cim.count > 0)
                cim.hasBeenPlaced = true;
            if (cim.isDynamic)
                cim.count = 0;
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
        if (!obj.cim)
            return;
        if (!obj.cim.isDynamic && obj.cim.hasBeenPlaced)
            return;

        obj.cim.setMatrixAt(obj.cim.count, obj.matrixWorld);
        obj.cim.setColorAt(obj.cim.count, obj.color);
        obj.cim.instanceMatrix!.needsUpdate = true;
        obj.cim.instanceColor!.needsUpdate = true;
        obj.cim.count++;
    }
}

export class CoolMesh extends Object3D {
    cim: CoolInstancedMesh | undefined;
    color: Color;
    constructor(cim?: CoolInstancedMesh, color = new Color(0xffffff)) {
        super();
        this.cim = cim;
        this.color = color;
    }
}

export class CoolInstancedMesh extends InstancedMesh {
    isDynamic = true;
    hasBeenPlaced = false;
    constructor(geo: BufferGeometry, mat: Material, amount = 1000, isDynamic = true) {
        super(geo, mat, amount);
        this.isDynamic = isDynamic;
        this.count = 0;
    }
}
