import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, DoubleSide, Face3, Geometry, Material,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Renderer,
  Scene,
  SphereGeometry, TorusGeometry, Vector3,
  WebGLRenderer
} from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  scene: Scene;
  camera: Camera;
  geometry: Geometry;
  shape: Mesh;
  axes: AxesHelper;

  renderer: Renderer;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  ADD = 0.01;

  createGeometry() {
    this.geometry = new Geometry();
    this.geometry.vertices.push(new Vector3(3, 0, 0));
    this.geometry.vertices.push(new Vector3(0, 5, 0));
    this.geometry.vertices.push(new Vector3(0, 0, 2));
    this.geometry.vertices.push(new Vector3(1, 2, -2));

    this.geometry.faces.push(new Face3(0, 1, 2));
    this.geometry.faces.push(new Face3(1, 2, 3));
    this.geometry.faces.push(new Face3(0, 2, 3));



    let material = new MeshBasicMaterial({
      color: 0xffffff, side: DoubleSide, wireframe : true
    });
    this.shape = new Mesh(this.geometry, material);
    this.scene.add(this.shape);
  }


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
    this.scene.background = new Color(0x000000);
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
      this.camera.position.y = 5;
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
    // this.shape.rotation.x += this.ADD;
   // this.shape.rotation.y += this.ADD;
    this.geometry.vertices[1].y -= 0.02;
    this.geometry.verticesNeedUpdate = true;
    this.renderer.render(this.scene, this.camera);
  }


  private createAxesHelper() {
    this.axes = new AxesHelper(5);
    this.scene.add(this.axes);
  }
}
