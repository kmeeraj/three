import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, DoubleSide, Face3, FontLoader, Geometry, Material,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Renderer,
  Scene,
  SphereGeometry, TextGeometry, TorusGeometry, Vector3,
  WebGLRenderer
} from 'three';
import {jsondata} from '../font-dat';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  scene: Scene;
  camera: Camera;
  geometry: TextGeometry;
  loader: FontLoader;
  axes: AxesHelper;
  text: Mesh;

  renderer: Renderer;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  ADD = 0.01;

  createFont() {
    this.loader = new FontLoader();
    let font = this.loader.parse(jsondata);
    this.geometry = new TextGeometry('Hello Meeraj', {font: font, size: 5, height: 2});
    let material = new MeshBasicMaterial({color: 0X034b59});
    this.text = new Mesh(this.geometry, material);
    this.text.position.x = -15;
    this.scene.add(this.text);
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
    this.createFont();
    this.createAxesHelper();
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
     this.camera.position.z = 30;
     this.camera.position.x = 2;
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
    this.text.rotation.x += this.ADD;
    this.renderer.render(this.scene, this.camera);
  }


  private createAxesHelper() {
    this.axes = new AxesHelper(5);
    this.scene.add(this.axes);
  }
}
