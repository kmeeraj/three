import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, ConeGeometry, CylinderGeometry, DirectionalLight, DirectionalLightHelper,
  DoubleSide,
  Mesh,
  MeshPhongMaterial, OrthographicCamera,
  PerspectiveCamera, PlaneGeometry,
  Renderer,
  Scene, SphereGeometry, SpotLight, Vector3,
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
  ADD = 0.01;
  private axes: AxesHelper;
  theta = 0;
  spheres: Mesh[] = [];
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
    // this.switchCamera();
    this.createAxes();
    this. createLight();
    this.createGeometry();
    this.startRendering();
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0Xffffff);
  }

  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.set(0, 0, 50);
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
    this.camera.lookAt(this.sphere.position);
    this.sphere.position.y = 20 * Math.sin(this.theta);
    this.sphere.position.z = 20 * Math.cos(this.theta);
    this.camera.position.y = this.sphere.position.y;
    this.camera.position.z = this.sphere.position.z + 5;
    this.theta += this.ADD;
    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    const RADIUS =4, BASE_X = -15 ,  BASE_y = -15;
    let material = new MeshPhongMaterial({color: 0x0450fb, shininess: 100, side: DoubleSide});
    for (let i = 0 ; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let geometry = new SphereGeometry(RADIUS, 30, 30);
          let sphere = new Mesh(geometry, material);
          sphere.position.x = BASE_X + j * 2 * (RADIUS + 0.5);
          sphere.position.z = -2 * RADIUS * i;
          sphere.position.y = BASE_y + i * RADIUS;
          this.scene.add(sphere);
        }
    }
    let geometry = new SphereGeometry(2, 30, 30);
    material = new MeshPhongMaterial({color: 0x00ff00, shininess: 100, side: DoubleSide});
    this.sphere = new Mesh(geometry, material);
    this.sphere.position.y = 20;
    this.scene.add(this.sphere);
  }

  private switchCamera(){
    if( this.camera instanceof PerspectiveCamera ){
      this.camera = new OrthographicCamera(-300, 300, 400, -400 , 1, 1000)
      this.camera.zoom = 5;
      this.camera.updateProjectionMatrix();
    }else {
      this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
      this.camera.position.set(0, 0, 40);
    }
  }

  private createLight() {
    this.light = new DirectionalLight(0xffffff, 1);
    this.light.position.set(0, 10, 15);
    this.scene.add(this.light);
  }
}
