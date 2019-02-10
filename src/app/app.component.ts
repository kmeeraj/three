import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
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
  torus: Mesh;
  innertorus: Mesh
  outertorus: Mesh;
  sphere: Mesh;

  renderer: Renderer;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  ADD = 0.01;

  createDonut() {
    let geometry = new TorusGeometry(3, 1 , 2, 30);
    let material = new MeshBasicMaterial({color: 0xffffff, wireframe: true});
    this.torus = new Mesh(geometry, material);
    this.scene.add(this.torus);

    let innergeometry = new TorusGeometry(6, 1 , 2, 30);
    let innermaterial = new MeshBasicMaterial({color: 0xffffff, wireframe: true});
    this.innertorus = new Mesh(innergeometry, innermaterial);
    this.scene.add(this.innertorus);

    let outergeometry = new TorusGeometry(9, 1 , 2, 30);
    let outermaterial = new MeshBasicMaterial({color: 0xffffff, wireframe: true});
    this.outertorus = new Mesh(outergeometry, outermaterial);
    this.scene.add(this.outertorus);
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
    this.createSphere();
    this.createDonut();

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
    this.torus.rotation.x = 90;
    this.torus.rotation.y = - 15;
    if ( this.torus.position.y > 5 || this.torus.position.y < -5 ) {
      this.ADD *= -1;
    }
    this.torus.position.y += this.ADD;

    this.innertorus.rotation.x = 90;
    this.innertorus.rotation.y = - 15;
    this.innertorus.position.y += this.ADD;

    this.outertorus.rotation.x = 90;
    this.outertorus.rotation.y = - 15;
    this.outertorus.position.y += this.ADD;

    this.sphere.rotation.x = 90;
    this.sphere.rotation.y = - 15;
    this.sphere.position.y += this.ADD;

    this.renderer.render(this.scene, this.camera);
  }

  private createSphere() {
    let geometry = new SphereGeometry(3, 30 , 30);
    let material = new MeshBasicMaterial({color: 0xffffff, wireframe: true});
    this.sphere = new Mesh(geometry, material);
    this.scene.add(this.sphere);
  }
}
