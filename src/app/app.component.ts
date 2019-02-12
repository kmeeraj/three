import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, ConeGeometry,
  DoubleSide, HemisphereLight,
  Mesh,
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
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  private cube: Mesh;
  private cone: Mesh;
  private plane: Mesh;
  private sphere: Mesh;

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
    /*this.light.intensity += this.ADD;
    if(this.light.intensity >= 8 || this.light.intensity <= 1){
      this.ADD *= -1;
    }*/

    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let geometry = new BoxGeometry(5, 5, 5);
    let material = new MeshPhongMaterial({color: 0xdff913, shininess: 100, side: DoubleSide});
    this.cube = new Mesh(geometry, material);
    this.cube.position.set(5, 0, 0);

    let cgeometry = new SphereGeometry(5, 30, 30);
    material = new MeshPhongMaterial({color: 0x66cdaa, shininess: 100, side: DoubleSide});
    this.sphere = new Mesh(cgeometry, material);
    this.sphere.position.set(-5, 5, -5);

    geometry  = new BoxGeometry(2000, 1, 200);
    let mat = new MeshPhongMaterial({ color: 0x693421, side: DoubleSide});
    this.plane = new Mesh(geometry, mat);

    this.scene.add(this.cube);
    this.scene.add(this.sphere);
    this.scene.add(this.plane);
  }

  private createLight() {
    // this.light = new AmbientLight(0x63b8ff);
    // this.light = new HemisphereLight(0xffffff, 0x000000);
    this.light = new HemisphereLight(0x00ff00, 0x0000ff);
    //this.light.intensity = 3;
    this.scene.add(this.light);
  }
}
