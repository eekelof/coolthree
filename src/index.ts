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
        cim.parent?.remove(cim);
        this.cims.delete(name);
        cim.geometry?.dispose();
        (cim.material as THREE.Material)?.dispose();
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
        const cim = obj.cim;
        if (!cim.isDynamic && cim.hasBeenPlaced)
            return;

        cim.setMatrixAt(cim.count, obj.matrixWorld);
        cim.setColorAt(cim.count, obj.color);
        cim.instanceMatrix!.needsUpdate = true;
        cim.instanceColor!.needsUpdate = true;
        cim.count++;
    }
}

export class CoolMesh extends Object3D {
    cim: CoolInstancedMesh | null;
    color: Color;
    constructor(cim: CoolInstancedMesh | null, color: Color) {
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
