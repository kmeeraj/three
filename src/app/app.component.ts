import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  BoxGeometry,
  Camera,
  Color, DirectionalLight,
  DoubleSide, Mesh,
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
  private mouse: Vector3;
  private spherematerial: MeshPhongMaterial;
  private boxMaterial: MeshPhongMaterial;

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
    this.camera.position.set(0, 10, 40);
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

    this.sphere.material['color'].set(0x0450fb);
    this.cube.material['color'].set(0xff4500);
    let intersects = this.rayCast.intersectObjects(this.scene.children);
    console.log(intersects[0]);
    intersects.forEach((i) => i.object['material']['color'].set(0x00ff00));
    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let geometry = new SphereGeometry (5, 30 , 30);
     this.spherematerial = new MeshPhongMaterial({color: 0x0450fb, shininess: 100, side: DoubleSide});
    this.sphere = new Mesh(geometry, this.spherematerial);
    this.sphere.position.set(1, 4, -10);

    let geo = new BoxGeometry(5, 5, 5);
    this.boxMaterial = new MeshPhongMaterial({color: 0xff4500, shininess:100, side: DoubleSide});
    this.cube = new Mesh(geo, this.boxMaterial);
    this.cube.position.set(10, 4 , -10);
    this.scene.add(this.cube);
    this.scene.add(this.sphere);

  }

  private createLight() {
    this.light1 = new DirectionalLight(0xffffff,1);
    this.light2 = new DirectionalLight(0xffffff,1);
    this.light2.position.set(0, -5, 2);
    this.scene.add(this.light1);
    this.scene.add(this.light2);

    this.rayCast = new Raycaster();
    this.mouse = new Vector3();
    this.mouse.x = this.mouse.y = -1;
  }

  private mouseclick(e: MouseEvent) {
    this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(e.clientX / window.innerWidth) * 2 + 1;
    this.mouse.z = 1;
    this.rayCast.setFromCamera(this.mouse, this.camera);
  }
}
