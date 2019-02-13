import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, ConeGeometry, CylinderGeometry, DirectionalLight,
  DoubleSide,
  Mesh, MeshLambertMaterial,
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
  private light: DirectionalLight;
  ADD = 0.02;
  LEFT = 37;
  RIGHT = 39;
  UP = 38;
  DOWN = 40;
  cubes = [];
  _this = this;
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
    document.addEventListener('click', (e) => this.onMouseClick(e), false);
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
    this.camera.position.set(0, 0, 35);
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
   this.cube.rotation.x += this.ADD;
    this.cube.rotation.y += this.ADD;
    this.renderer.render(this.scene, this.camera);
  }
  private createGeometry() {
    let geometry = new BoxGeometry(5, 5, 5);
    let material = new MeshPhongMaterial({
      color: 0xaf62ff, shininess: 100,
      side: DoubleSide
    });
    this.cube = new Mesh(geometry, material);
    this.scene.add(this.cube);
  }

  private onKeyDown(e) {
    console.log(e.keyCode);
    if (e.keyCode === this.LEFT) {
      this.camera.position.x  -= 0.2;
    } else if (e.keyCode === this.RIGHT) {
      this.camera.position.x  += 0.2;
    } else if (e.keyCode === this.UP) {
        this.camera.position.y  += 0.2;
    } else if (e.keyCode === this.DOWN) {
      this.camera.position.y  -= 0.2;
    }
    console.log(this.ADD);
    this.cubes.forEach(cube => {console.log(this.ADD); cube.position.x += this.ADD; });
  }

  private createLight() {
    this.light = new DirectionalLight(0xffffff, 1);
    // this.light.position.set(0, 10, 15);
    this.scene.add(this.light);
  }

  private onMouseClick(e: MouseEvent) {
    this.ADD *= -1;
    let x = e.clientX;
    let y = e.clientY;
    console.log(" x " + x + " y" + y);
  }
}
