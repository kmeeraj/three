import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

import {
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, CylinderGeometry, FaceNormalsHelper, Line, LineBasicMaterial, LineDashedMaterial,
  Mesh,
  MeshBasicMaterial, MeshDepthMaterial, MeshNormalMaterial,
  PerspectiveCamera,
  PlaneGeometry, Points, PointsMaterial,
  Renderer,
  Scene, SphereGeometry, TorusGeometry,
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
  pcylinder: Points;

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
    this.pcylinder.rotation.x += this.ADD;
    this.sphere.rotation.x += this.ADD;

    this.pcylinder.rotation.y += this.ADD;
    this.sphere.rotation.y += this.ADD;
    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    // let material = new LineBasicMaterial({color: 0Xffffff, linewidth: 1});
    // let material = new LineDashedMaterial({color: 0Xffffff, linewidth: 1, dashSize: 5, gapSize: 1});
    let material = new PointsMaterial({color: 0xfffffff});
    let geometry = new CylinderGeometry(3,2,  4);
    this.pcylinder = new Points(geometry, material);

    this.pcylinder.position.z = -10;
    this.pcylinder.position.z = -5;
    geometry.computeFaceNormals();

    let sgeometry = new SphereGeometry(3, 30,  30);
    this.sphere = new Line(sgeometry, material);
    this.sphere.position.z = 0;
    this.sphere.position.x = 5;
    sgeometry.computeBoundingBox();
    this.scene.add(this.pcylinder);
    this.scene.add(this.sphere);
  }

  private createAxes() {
    this.axes = new AxesHelper(15);
    this.scene.add(this.axes);
  }

}
