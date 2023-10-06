import { BufferGeometry, Color, InstancedMesh, Material, Object3D, Scene } from "three";

export class CoolThree {
    cims = new Map<string, CoolInstancedMesh>();

    add(scene: Scene, name: string, geo: BufferGeometry, mat: Material, amount = 1000, isDynamic = true) {
        const cim = new CoolInstancedMesh(geo, mat, amount, isDynamic);
        this.cims.set(name, cim);
        scene.add(cim);
    }
    get(name: string) {
        return this.cims.get(name);
    }
    update(scene: Scene) {
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
        for (const c of obj.children) {
            this.#traverseScene(c);
        }
        if (!(obj as CoolMesh).cim)
            return;
        const cim = (obj as CoolMesh).cim;
        if (!cim.isDynamic && cim.hasBeenPlaced)
            return;

        obj.updateMatrixWorld();
        cim.setMatrixAt(cim.count, obj.matrixWorld);
        cim.setColorAt(cim.count, (obj as CoolMesh).color);
        cim.instanceMatrix!.needsUpdate = true;
        cim.instanceColor!.needsUpdate = true;
        cim.count++;
    }
}

export class CoolMesh extends Object3D {
    cim: CoolInstancedMesh;
    color: Color;
    constructor(cim: CoolInstancedMesh, color: Color) {
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
