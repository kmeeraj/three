import {AfterViewInit, Component, ElementRef, HostListener, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, ConeGeometry, CylinderGeometry,
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
  private light: SpotLight;
  ADD = 0.2;
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
    document.addEventListener('keydown', (e) => this.onKeyDown(e), false);
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
    this.camera.position.set(0, 0, 100);
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
    this.camera.position.z -= 0.1;
    this.renderer.render(this.scene, this.camera);
  }

  randomInRange( from, to){
    let x  = Math.random() * (to - from);
    return from + x;

  }

  private createGeometry() {
    let geometry = new BoxGeometry(this.randomInRange(1, 3), this.randomInRange(1, 3) , this.randomInRange(1, 3));
    for ( let i = 0; i <= 150 ; i++ ) {
      let material = new MeshLambertMaterial({
        color: Math.random() * 0xffffff,
        side: DoubleSide
      });
      let cube = new Mesh(geometry, material);
      cube.position.x = this.randomInRange(-40, 40);
      cube.position.z = this.randomInRange(-40, 40);
      this.cubes.push(cube);
      this.scene.add(cube);
    }

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
    this.light = new SpotLight(0xffffff, 1);
    this.light.position.set(0, 10, 15);
    this.scene.add(this.light);
  }
}
