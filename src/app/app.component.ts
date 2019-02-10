import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AxesHelper,
  BoxGeometry,
  Camera,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Renderer,
  Scene,
  SphereGeometry, TorusGeometry,
  WebGLRenderer
} from 'three';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  scene: Scene;
  camera: Camera;

  rings: Mesh[] = [];
  sphere: Mesh;
  axes: AxesHelper;
  renderer: Renderer;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  ADD = 0.01;

  createDonut() {
    let geometry = new TorusGeometry(5.1, 0.7 , 2, 50);
    let material = new MeshBasicMaterial({color: 0xffe39f, wireframe: false});
    let torus = new Mesh(geometry, material);
    this.rings.push(torus);

    let innergeometry = new TorusGeometry(6.9, 0.7 , 2, 50);
    let innermaterial = new MeshBasicMaterial({color: 0xffad60, wireframe: false});
    let innertorus = new Mesh(innergeometry, innermaterial);
    this.rings.push(innertorus);

    let outergeometry = new TorusGeometry(8.5, 0.7 , 2, 50);
    let outermaterial = new MeshBasicMaterial({color: 0xeac086, wireframe: false});
    let outertorus = new Mesh(outergeometry, outermaterial);
    this.rings.push(outertorus);

    this.rings.forEach(ring => {
      ring.rotation.x = 1.5;
      ring.rotation.y = 0.5;
      this.scene.add(ring);
    });
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
    this.createPlanet();
    this.createDonut();
    this.createAxesHelper();
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
     this.camera.position.z = 20;
      this.camera.position.x = 4;
      this.camera.position.y = 5;
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
    this.camera.position.y += this.ADD;
    if ( this.camera.position.y > 5 || this.camera.position.y < -5 ) {
      this.ADD *= -1;
    }
    this.renderer.render(this.scene, this.camera);
  }

  private createPlanet() {
    let geometry = new SphereGeometry(4, 30 , 30);
    let material = new MeshBasicMaterial({color: 0x8d5524, wireframe: false});
    this.sphere = new Mesh(geometry, material);
    this.scene.add(this.sphere);
  }

  private createAxesHelper() {
    this.axes = new AxesHelper(5);
    this.scene.add(this.axes);
  }
}
