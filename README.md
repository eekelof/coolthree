# coolthree

[![npm](https://img.shields.io/npm/v/coolthree)](https://www.npmjs.com/package/coolthree)
[![npm](https://img.shields.io/npm/dm/coolthree)](https://www.npmjs.com/package/coolthree)
[![GitHub](https://img.shields.io/github/license/jgtools/textmesh)](https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt)

DX friendy dynamic InstancedMesh for three.js

## Features
- Abstraction for dynamic InstancedMesh
- Use CoolMesh as regular Mesh (both extend Object3D)

## Installation
```bash
npm i coolthree
```

## Usage
```javascript
    import { CoolMesh, CoolThree } from 'coolthree';
    
    const ct = new CoolThree();

    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshPhongMaterial();
    ct.add(scene, "cube", geo, mat, 1000);

    const size = 30;
    const particles = [];
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const mesh = new CoolMesh(ct.get("cube"), new THREE.Color(0xff0000));
            mesh.position.set(x, y, -8);
            particles.push({ mesh, a: Math.random() * Math.PI * 2 });
            scene.add(mesh);
        }
    }

    // in update()
    for (const p of particles) {
        p.mesh.position.x += delta * Math.cos(p.a);
        p.mesh.position.y += delta * Math.sin(p.a);
        p.mesh.rotation.x += delta * 0.03 * p.a;
    }
    ct.update(scene);
```

#### [Complete usage example](https://codesandbox.io/s/coolthree-example-8yjzm6)

## Docs

### CoolThree
`new CoolThree()`

`add(scene: Object3D, name: string, geo: BufferGeometry, mat: Material, amount = 1000): void`

`remove(name: string): void`

`get(name: string): InstancedMesh`

`update(scene: Object3D): void`

### CoolMesh
`new CoolMesh(im: InstancedMesh, color: Color)`

## License

MIT
