import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, FaceNormalsHelper,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Renderer,
  Scene,
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
  normals: FaceNormalsHelper;
  axes: AxesHelper;

  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  private ADD = 0.01;

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
    this.createAxes();
    this.startRendering();
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0x123456);
  }

  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = 30;
    this.camera.position.y = 3;
    this.camera.position.x = 4;
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
    this.normals.update();

    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let geometry = new BoxGeometry(5,5,  5);
    let material = new MeshBasicMaterial({color: 0Xbbbbbb, wireframe: true});

    this.cube = new Mesh(geometry, material);
    this.normals = new FaceNormalsHelper(this.cube, 5);
    this.scene.add(this.cube);
    this.scene.add(this.normals);
  }

  private createAxes() {
    this.axes = new AxesHelper(15);
    this.scene.add(this.axes);
  }
}
