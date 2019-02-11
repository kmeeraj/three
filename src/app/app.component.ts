import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

import {
  AxesHelper,
  BoxGeometry,
  Camera,
  Color,
  ConeGeometry,
  CylinderGeometry,
  DirectionalLight,
  DoubleSide,
  FaceNormalsHelper,
  Geometry,
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  Mesh,
  MeshBasicMaterial,
  MeshDepthMaterial,
  MeshLambertMaterial,
  MeshNormalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Renderer,
  Scene,
  SphereGeometry,
  TorusGeometry,
  Vector3,
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
  sphere: Mesh;
  cone: Mesh;
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
    this.createLight();
    this.createGeometry();
    this.startRendering();
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0XFFFFFF);
  }

  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = 20;
    this.camera.position.x = 4;
    this.camera.position.y = 3;
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
    this.cube.rotation.x += this.ADD;
    this.cube.rotation.y += this.ADD;
    this.sphere.rotation.x += this.ADD;
    this.sphere.rotation.y += this.ADD;
    this.cone.rotation.x += this.ADD;
    this.cone.rotation.y += this.ADD;
    this.renderer.render(this.scene, this.camera);
  }


  private createGeometry() {
    let material = new MeshLambertMaterial( {
      side: DoubleSide, color: 0x7fc5f9, emissive: 0x25673d, emissiveIntensity: 0.5
    });
    let geometry = new BoxGeometry(3, 3, 3);
    this.cube = new Mesh(geometry, material);
    this.cube.position.x = -6;

    let sgeometry = new SphereGeometry(3, 30, 30);
    this.sphere = new Mesh(sgeometry, material);
    this.sphere.position.x = 0;

    let cgeometry = new ConeGeometry(3, 4, 20, 1, true);
    this.cone = new Mesh(cgeometry, material);
    this.cone.position.x = 7

    this.scene.add(this.cube);
    this.scene.add(this.sphere);
    this.scene.add(this.cone);
  }

  private createAxes() {
    this.axes = new AxesHelper(15);
    this.scene.add(this.axes);
  }

  private createLight() {
    let directionLight = new DirectionalLight(0xFFFFFF);
    this.scene.add(directionLight);
  }
}
