import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, ConeGeometry, DirectionalLight, DirectionalLightHelper,
  DoubleSide, HemisphereLight,
  Mesh, MeshBasicMaterial,
  MeshPhongMaterial, Object3D,
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
  private target1: Object3D;
  private target2: Object3D;
  theta = 0;
  private light: SpotLight;
  private spotlight1: SpotLight;
  private spotlight2: SpotLight;
  ADD = 0.1;
  private lightHelper: DirectionalLightHelper;
  cubes = [];

  randomInRange(from, to){
    let x = Math.random() * (to - from);
    return x + from;
  }

  createCube() {
    let w = this.randomInRange(5, 8 );
    let h = this.randomInRange(5, 8);
    let d = this.randomInRange(5, 8);
    let geometry = new BoxGeometry(w, h, d);
    let material = new MeshPhongMaterial({
      color: Math.random() * 0xffffff
    });
    let cube = new Mesh(geometry, material);
    cube.position.set(this.randomInRange(-20, 20), 0, this.randomInRange(-20, 20) );
    this.cubes.push(cube);
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
    this.createAxes();

    this.createGeometry();
    this. createLight();
    this.createTragets();
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
    this.target1.position.x -= this.ADD;
    this.target2.position.x += this.ADD;
    if ( this.target1.position.x > 20 || this.target1.position.x < -20 ) {
      this.ADD *= -1;
    }
    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {

    let geo = new BoxGeometry(2000, 1, 2000);
    let mat = new MeshPhongMaterial({color: 0x693421, side: DoubleSide});
    this.plane = new Mesh(geo, mat);
    this.plane.position.y = -1;
    for (let i = 1; i <= 10; i++) {
      this.createCube();
    }
    this.cubes.forEach( cube => this.scene.add(cube));
    this.scene.add(this.plane);

  }

  private createTragets(){
    this.target1 = new Object3D();
    this.target1.position.set(20, 0, 0 );
    this.spotlight1.target = this.target1;
    this.scene.add(this.target1);

    this.target2 = new Object3D();
    this.target2.position.set(-10, 0, 0 );
    this.spotlight2.target = this.target2;
    this.scene.add(this.target2);

  }

  private createLight() {
    this.spotlight1 = new SpotLight(0xffffff, 1);
    this.spotlight1.position.set(15, 20, 10);
    this.spotlight1.angle = Math.PI / 20;
    this.spotlight1.penumbra = 0.05;
    this.spotlight1.decay = 2;
    this.spotlight1.distance = 200;
    this.scene.add(this.spotlight1);

    this.spotlight2 = new SpotLight(0xffffff, 1);
    this.spotlight2.position.set(-15, 20, 10);
    this.spotlight2.angle = Math.PI / 20;
    this.spotlight2.penumbra = 0.05;
    this.spotlight2.decay = 2;
    this.spotlight2.distance = 200;
    this.scene.add(this.spotlight2);
  }
}
