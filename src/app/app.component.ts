import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  BoxGeometry,
  Camera,
  Color, DirectionalLight,
  DoubleSide, Geometry, Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Raycaster,
  Renderer,
  Scene,
  SphereGeometry, Vector2, Vector3,
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
  private sphere: Mesh;
  private cube: Mesh;
  private light1: DirectionalLight;
  private light2: DirectionalLight;
  private rayCast: Raycaster;
  private mouse: Vector2;
  private spherematerial: MeshPhongMaterial;
  private boxMaterial: MeshPhongMaterial;
  RADIUS = 5;
  BASE_X = -20;
  BASE_Y = -20;
  ADD = 0.01;
  theta = 0;

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
    this.createGeometry();
    this.createLight();
    this.startRendering();
    this.canvas.addEventListener('click', this.mouseclick.bind(this), false);
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
    this.camera.position.set(0, 0, 40);
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

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  private createSphere(pos) {
    let material = new MeshPhongMaterial({color: 0x4a57fa, shininess: 100, side: DoubleSide});
    let geometry = new SphereGeometry(this.RADIUS, 30, 30);
    let sphere = new Mesh(geometry, material);
    sphere.position.set(pos.x, pos.y, pos.z);
    this.scene.add(sphere);
  }

  private createGeometry() {

    let spherematerial = new MeshPhongMaterial({color: 0x0450fb, shininess: 100, side: DoubleSide});
    for (let i = 0 ; i < 4 ; i++) {
      for ( let j = 0 ; j < 4; j++) {
        let geometry = new SphereGeometry (this.RADIUS, 30 , 30);
        let sphere = new Mesh( geometry, spherematerial);
        sphere.position.set(this.BASE_X + j * 2 * (this.RADIUS + 0.5 ),
                this.BASE_Y + i * this.RADIUS, -2 * this.RADIUS * i);
        this.scene.add(sphere);
      }
    }

  }

  private createLight() {
    this.light1 = new DirectionalLight(0xffffff,1);
    this.light2 = new DirectionalLight(0xffffff,1);
    this.light2.position.set(0, -5, 2);
    this.scene.add(this.light1);
    this.scene.add(this.light2);

    this.rayCast = new Raycaster();
    this.mouse = new Vector2();
    this.mouse.x = this.mouse.y = -1;
  }

  private mouseclick(e: MouseEvent) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientX / window.innerWidth) * 2 + 1;

    this.rayCast.setFromCamera(this.mouse, this.camera);
    let intersects = this.rayCast.intersectObjects(this.scene.children);
    intersects.forEach((i) => i.object.position.y += 1);
  }
}
