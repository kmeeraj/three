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
  PerspectiveCamera, PlaneGeometry,
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

  private light: DirectionalLight;
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
    this.scene.background = new Color(0xffffff);
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
    /*this.light.intensity += this.ADD;
    if(this.light.intensity >= 8 || this.light.intensity <= 1){
      this.ADD *= -1;
    }*/
    //this.lightHelper.update();
    this.light.position.x += this.ADD;
    this.sphere.position.x += this.ADD;
    if(this.light.position.x > 10 || this.light.position.x <= -10 ) {
      this.ADD *= -1;
    }
    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let geometry = new BoxGeometry(5, 5, 5);
    let material = new MeshPhongMaterial({color: 0X0f1d89, shininess: 100, side: DoubleSide});
    this.cube = new Mesh(geometry, material);
    this.cube.position.set(-6, -5, -10);

    let pgeometry = new PlaneGeometry(1000, 1000, 50, 50);
    let pmat = new MeshPhongMaterial({color: 0x693421, side: DoubleSide});
    this.plane = new Mesh(pgeometry, pmat);
    this.plane.rotation.x = Math.PI / 2;
    this.plane.position.y = -100;

    let cgeometry = new SphereGeometry(1, 30, 30);
    let bmaterial = new MeshBasicMaterial({color: 0xffd700});
    this.sphere = new Mesh(cgeometry, bmaterial);
    this.sphere.position.set(10, 5, 0);

    let cgeo = new ConeGeometry(3, 4, 20, 1, true);
    this.cone = new Mesh(cgeo, material);
    this.cone.position.x = 7;
    this.cone.position.y = -5;

    this.scene.add(this.cube);
    this.scene.add(this.sphere);
    this.scene.add(this.plane);
    this.scene.add(this.cone);
  }

  private createLight() {
    // this.light = new AmbientLight(0x63b8ff);
    // this.light = new HemisphereLight(0xffffff, 0x000000);
    // this.light = new HemisphereLight(0x00ff00, 0x0000ff);
    this.light = new DirectionalLight(0xffffff);
    this.light.position.set(10, 5, 0);
    // this.lightHelper = new DirectionalLightHelper(this.light , 5, 0x000000);
    // this.scene.add(this.lightHelper);
    // this.light.target = this.sphere;
    // this.light.intensity = 3;
    this.scene.add(this.light);
  }
}
