import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

import {
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, CylinderGeometry, FaceNormalsHelper, Geometry, Line, LineBasicMaterial, LineDashedMaterial,
  Mesh,
  MeshBasicMaterial, MeshDepthMaterial, MeshNormalMaterial,
  PerspectiveCamera,
  PlaneGeometry, Points, PointsMaterial,
  Renderer,
  Scene, SphereGeometry, TorusGeometry, Vector3,
  WebGLRenderer
} from 'three';
import {getOrSetAsInMap} from '@angular/animations/browser/src/render/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'threed';
  scene: Scene;
  camera: Camera;
  renderer: Renderer;
  cube1: Mesh;
  cube2: Mesh;
  plane: Mesh;
  cube: Mesh;
  torus: Mesh;
  sphere: Line;
  normals: FaceNormalsHelper;
  axes: AxesHelper;
  cylinder: Line;
  particles: Points;

  public fieldOfView = 75;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  private ADD = 0.02;


  constructor() {
    this.render = this.render.bind(this);
  }

  @ViewChild('canvas')
  private canvasRef: ElementRef;

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }


  ngAfterViewInit() {
    this.createScene();
    this.createCamera();
    this.createAxes();
    this.createGeometry();
    this.startRendering();
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0X000000);
  }

  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = 5;
  }

  private getAspectRatio(): number {
    let height = this.canvas.clientHeight;
    if (height === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private startRendering() {
    this.renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    let component: AppComponent = this;

    (function render() {
      requestAnimationFrame(render);
      component.render();
    }());
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  randomInRange (from, to){
    let x = Math.random() * ( to - from );
    return x  + from;
  }

  private createGeometry() {
    let material = new PointsMaterial({color: 0xfffffff, size: 0.5});
    let geometry = new Geometry();

    for (let i = 1; i <= 1000 ; i++) {
      let x = this.randomInRange(-25, 25);
      let y = this.randomInRange(-25, 25);
      let z = this.randomInRange(-25, 25);
      geometry.vertices.push(new Vector3(x, y, z));
    }
    geometry.computeFaceNormals();
    this.particles = new Points(geometry, material);
    this.scene.add(this.particles);
  }

  private createAxes() {
    this.axes = new AxesHelper(15);
    this.scene.add(this.axes);
  }

}
