import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, ConeGeometry, CylinderGeometry,
  DoubleSide,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera, PlaneGeometry,
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
  camera: PerspectiveCamera;
  cylinder: Mesh;
  sphere: Mesh;

  renderer: Renderer;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  private cube: Mesh;
  private cone: Mesh;
  private plane: Mesh;
  private light: SpotLight;
  ADD = 0.1;
  private axes: AxesHelper;

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
    this.scene.background = new Color(0X000000);
  }

  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.set(0, 10, 20);
;  }

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
    this.camera.fov += this.ADD;
    this.camera.updateProjectionMatrix();
    if( this.camera.fov > 100 || this.camera.fov < 50){
      this.ADD *= -1;
    }
    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let geometry = new CylinderGeometry(5, 5, 5);
    let material = new MeshPhongMaterial({color: 0x448844, shininess: 100, side: DoubleSide});
    this.cylinder = new Mesh(geometry, material);
    this.cylinder.position.set(6, 0, -2);

    let cgeometry = new SphereGeometry(5, 30, 30);
    material = new MeshPhongMaterial({color: 0x693421, side: DoubleSide});
    this.sphere = new Mesh(cgeometry, material);
    this.sphere.position.set(-5, 5, 2);

    let pgeometry  = new PlaneGeometry(1000, 1000, 50, 50);
    let mat = new MeshPhongMaterial({ color: 0xabcdef, side: DoubleSide});
    this.plane = new Mesh(pgeometry, mat);
    this.plane.rotation.x = Math.PI / 2;
    this.plane.position.y = -100;

    this.scene.add(this.cylinder);
    this.scene.add(this.sphere);
    this.scene.add(this.plane);
  }

  private createLight() {
    this.light = new SpotLight(0xffffff, 1);
    this.light.position.set(0, 10, 15);
    this.scene.add(this.light);
  }
}
