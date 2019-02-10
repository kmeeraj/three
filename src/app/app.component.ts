import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  BoxGeometry,
  Camera,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Renderer,
  Scene,
  SphereGeometry, TorusGeometry,
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
  torus: Mesh;
  renderer: Renderer;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  ADD = 0.01;

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
    this.createTorus();
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
    this.torus.rotation.x += this.ADD;
    this.torus.rotation.y += this.ADD;
    this.torus.rotation.z += this.ADD;
    this.renderer.render(this.scene, this.camera);
  }

  private createTorus() {
    let geometry = new TorusGeometry(5, 1 , 30, 30, Math.PI);
    let material = new MeshBasicMaterial({color: 0xffffff, wireframe: true});
    this.torus = new Mesh(geometry, material);
    this.scene.add(this.torus);
  }
}
