import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AxesHelper,
  Camera,
  Color, DirectionalLight,
  DoubleSide,
  Face3,
  Geometry,
  Mesh, MeshBasicMaterial,
  PerspectiveCamera,
  Renderer,
  Scene,
  Vector3,
  WebGLRenderer
} from 'three';
import {forEach} from '@angular/router/src/utils/collection';
import {Fragment} from './fragment';

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
  geometry: Geometry;
  axes: AxesHelper;
  shape: Mesh;
  shapes: Mesh[] = [];
  ADD = 0.05;
  fragments = [];
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;

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
    this.scene.background = new Color(0X000000);
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

  private createAxes() {
    this.axes = new AxesHelper(15);
    this.scene.add(this.axes);
  }

  public render() {
    this.fragments.forEach(f => f.move());

    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let p1 = new Vector3(0, 1, 0);
    let p2 = new Vector3(1, 0, 1);
    let p3 = new Vector3(-1, 0, 1);
    let p4 = new Vector3(-1, 0, -1);
    let p5 = new Vector3(1, 0, -1);
    let p6 = new Vector3(0, -1, 0);

    this.fragments.push(new Fragment(new Vector3(0, 0, 0),
      new Vector3(0, 0, 6), this.createTriangle(p1, p2, p3)));

    this.fragments.push(new Fragment(new Vector3(0, 0, 0),
      new Vector3(-2, 4, 0), this.createTriangle(p1, p3, p4)));
    this.fragments.push(new Fragment(new Vector3(0, 0, 0),
      new Vector3(0, 5, -4), this.createTriangle(p1, p4, p5)));
    this.fragments.push(new Fragment(new Vector3(0, 0, 0),
      new Vector3(2, 3, 0), this.createTriangle(p1, p5, p2)));
    this.fragments.push(new Fragment(new Vector3(0, 0, 0),
      new Vector3(0, -5, 3), this.createTriangle(p3, p2, p6)));
    this.fragments.push(new Fragment(new Vector3(0, 0, 0),
      new Vector3(-4, -3, 0), this.createTriangle(p6, p3, p4)));
    this.fragments.push(new Fragment(new Vector3(0, 0, 0),
      new Vector3(0, -4, -4), this.createTriangle(p6, p4, p5)));
    this.fragments.push(new Fragment(new Vector3(0, 0, 0),
      new Vector3(3, -3, 0), this.createTriangle(p6, p2, p5)));

    this.fragments.forEach(f => this.scene.add(f.shape));
  }

  createTriangle(p1, p2, p3) {
    let geometry = new Geometry();
    geometry.vertices.push(p1, p2, p3);
    geometry.faces.push( new Face3(0, 1, 2));
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    return geometry;
  }

  private createLight() {
    let directionalLightUp = new DirectionalLight( 0xffffff);
    this.scene.add(directionalLightUp);
  }
}
