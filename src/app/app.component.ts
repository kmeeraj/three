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
  Scene, SphereGeometry,
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
  theta = 0;
  private light: PointLight;
  ADD = 0.03;
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
    this.camera.position.set(0, 0, 20);
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
    this.light.position.y = 6 * Math.cos(this.theta);
    this.light.position.x = 6 * Math.sin(this.theta);
    this.sphere.position.x = this.light.position.x;
    this.sphere.position.y = this.light.position.y;

    this.theta += this.ADD;
    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let geometry = new BoxGeometry(5, 5, 5);
    let material = new MeshPhongMaterial({color: 0xdff913, shininess: 100, side: DoubleSide});
    this.cube = new Mesh(geometry, material);
    this.cube.rotation.x = 0.6;
    this.cube.rotation.y = 0.6;

    let geo = new SphereGeometry(0.1, 30, 30);
    let mat = new MeshBasicMaterial({color: 0xffffff});
    this.sphere = new Mesh(geo, mat);
    this.scene.add(this.sphere);

    this.scene.add(this.cube);

  }

  private createLight() {
    this.light = new PointLight(0xffffff, 2, 20 , 2);


    // let ambient = new AmbientLight(0xeeeeee, 1);
    // this.scene.add(ambient);
    this.scene.add(this.light);
  }
}
