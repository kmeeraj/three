import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AxesHelper,
  Camera,
  Color,
  DoubleSide,
  Face3,
  Geometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Renderer,
  Scene, Vector3,
  WebGLRenderer
} from 'three';

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
  shape: Mesh;
  axes: AxesHelper;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  ADD  = 0.5;

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

    this.createGeometry();
    this.createAxesHelper();
    this.startRendering();
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0x123456);
  }

  createGeometry() {
    this.geometry = new Geometry();
    this.geometry.vertices.push(new Vector3(0, 0, 0));
    this.geometry.vertices.push(new Vector3(5, 0, 1));
    this.geometry.vertices.push(new Vector3(2, 4, 3));
    this.geometry.vertices.push(new Vector3(2, 2, -3));

    this.geometry.faces.push(new Face3(0, 1, 2));
    this.geometry.faces.push(new Face3(0, 1, 3));

    let material = new MeshBasicMaterial({
      color: 0xffffff, side: DoubleSide, wireframe : true
    });
    this.shape = new Mesh(this.geometry, material);
    this.shape.rotation.z = 0.7;
    this.shape.rotation.x = 0.6;
    this.scene.add(this.shape);
  }


  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = 20;
    this.camera.position.x = 10;
    this.camera.position.y = 5;
  }


  private createAxesHelper() {
    this.axes = new AxesHelper(5);
    this.scene.add(this.axes);
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


  public action() {
    this.geometry.vertices[2].y += this.ADD;
    this.geometry.vertices[3].y += this.ADD;
    if (this.geometry.vertices[2].y < -4 || this.geometry.vertices[2].y > 4){
      this.ADD *= -1;
    }
    this.geometry.verticesNeedUpdate = true;
  }
  public render() {
    this.action();
    this.renderer.render(this.scene, this.camera);
  }
}
