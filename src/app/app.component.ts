import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, ConeGeometry,
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera, PlaneGeometry,
  Renderer,
  Scene,
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
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  private cube: Mesh;
  private cone: Mesh;
  private plane: Mesh;
  private light: AmbientLight;
  ADD = 0.02;

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
    this. createLight();
    this.createGeometry();
    this.startRendering();
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0xffffff);
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



  private createAxes() {
    this.axes = new AxesHelper(35);
    this.scene.add(this.axes);
  }

  public render() {
    this.light.intensity += this.ADD;
    if(this.light.intensity >= 8 || this.light.intensity <= 1){
      this.ADD *= -1;
    }

    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let geometry = new BoxGeometry(5, 5, 5);
    let material = new MeshPhongMaterial({color: 0x0f1d89, shininess: 100, side: DoubleSide});
    this.cube = new Mesh(geometry, material);
    this.cube.position.x = -6;
    this.cube.position.y = -5;
    this.cube.position.z = -6;

    let cgeometry = new ConeGeometry(3, 4, 20, 1, true);
    this.cone = new Mesh(cgeometry, material);
    this.cone.position.x = 7;
    this.cone.position.y = -5;

    let pgeometry  = new PlaneGeometry(1000, 1000, 50, 50);
    let mat = new MeshPhongMaterial({ color: 0x693421, side: DoubleSide});
    this.plane = new Mesh(pgeometry, mat);
    this.plane.rotation.x = Math.PI / 2;
    this.plane.position.y = -100;

    this.scene.add(this.cube);
    this.scene.add(this.cone);
    this.scene.add(this.plane);
  }

  private createLight() {
    this.light = new AmbientLight(0xffffff);
    this.light.intensity = 3;
    this.scene.add(this.light);
  }
}
