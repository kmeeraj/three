import {DoubleSide, Mesh, MeshPhongMaterial} from 'three';

export class Fragment {
  private velocity: any;
  private shape: any;
  dt = 0.02;
  ADD = 0.05;
  constructor(position, velocity, g) {
    this.velocity = velocity;
    this.velocity.multiplyScalar(this.dt);

    let material = new MeshPhongMaterial({
      side: DoubleSide,
      color: 0xffffff,
      emissive: 0xfafafa,
      emissiveIntensity: 0.4,
      shininess: 100,
      specular: 0x9d0a00,
    });

    this.shape = new Mesh(g, material);
    this.shape.position.copy(position);
  }

  move() {
    this.shape.position.add(this.velocity);
    this.shape.rotation.x += this.ADD;
  }

}
