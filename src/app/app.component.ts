import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {BoxGeometry, Camera, Color, Mesh, MeshBasicMaterial, PerspectiveCamera, Renderer, Scene, WebGLRenderer} from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'threed';
  scene: Scene;
  camera: Camera;
  cube: Mesh;
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
    this.createCube();
    this.startRendering();
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0xababab);
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
    // console.log("Hello");

    this.renderer.render(this.scene, this.camera);
    this.cube.position.x += this.ADD;
    this.cube.rotation.z += this.ADD;
    if (this.cube.position.x <= -3 || this.cube.position.x >= 3) {
      this.ADD *= -1;
    }
  }

  private createCube() {
    let geometry = new BoxGeometry(1,1,1);
    let material = new MeshBasicMaterial({color:0x00a1cb});
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);
  }
}
