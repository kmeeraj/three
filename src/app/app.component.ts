import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, ConeGeometry, DirectionalLight, DirectionalLightHelper,
  DoubleSide, HemisphereLight,
  Mesh, MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera, PlaneGeometry, PointLight,
  Renderer,
  Scene, SphereGeometry, SpotLight,
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
  axes: AxesHelper;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  private cube: Mesh;
  private cone: Mesh;
  private plane: Mesh;
  private sphere: Mesh;
  private sphere1: Mesh;
  private sphere2: Mesh;
  theta = 0;
  private light: SpotLight;
  private light1: PointLight;
  private light2: PointLight;
  ADD = 0.01;
  private lightHelper: DirectionalLightHelper;

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

    this.createGeometry();
    this. createLight();
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
    this.camera.position.set(0, 10, 20);
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
    this.light.angle += this.ADD;
    if ( this.light.angle > Math.PI / 2 || this.light.angle < 0 ) {
      this.ADD *= -1;
    }
    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let geometry = new BoxGeometry(5, 5, 5);
    let material = new MeshPhongMaterial({color: 0xdff913, shininess: 100, side: DoubleSide});
    this.cube = new Mesh(geometry, material);
    this.cube.position.set(5, 0, 0);

    let geo = new BoxGeometry(2000, 1, 2000);
    let mat = new MeshPhongMaterial({color: 0x693421, side: DoubleSide});
    this.plane = new Mesh(geo, mat);
    this.plane.position.y = -1;

    this.scene.add(this.plane);

    this.scene.add(this.cube);

  }

  private createLight() {
    this.light = new SpotLight(0xffffff, 1);
    this.light.position.set(15, 20, 10);
    this.light.angle = Math.PI / 20;
    this.light.penumbra = 0.05;
    this.light.decay = 2;
    this.light.distance = 200;
    this.scene.add(this.light);
  }
}
