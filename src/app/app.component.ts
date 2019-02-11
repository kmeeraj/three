import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AxesHelper,
  BoxGeometry,
  Camera,
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Renderer,
  Scene,
  WebGLRenderer
} from 'three';
import {getOrSetAsInMap} from '@angular/animations/browser/src/render/shared';

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
  cube1: Mesh;
  cube2: Mesh;
  plane: Mesh;
  axes: AxesHelper;

  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  private ADD = 0.1;

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
    this.createAxes();
    this.startRendering();
  }

  private createScene() {
    this.scene = new Scene();
    this.scene.background = new Color(0x123456);
  }

  private createCamera() {
    let aspectRatio = this.getAspectRatio();
    this.camera = new PerspectiveCamera(this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = 30;
    this.camera.position.y = 3;
    this.camera.position.x = 4;
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
    this.cube1.position.x += this.ADD;
    this.cube2.position.x -= this.ADD;
    if(this.cube1.position.x > 6 || this.cube1.position.x < -6){
      this.ADD *= -1;
    }
    this.renderer.render(this.scene, this.camera);
  }

  private createGeometry() {
    let geometry = new BoxGeometry(5,5, 5);
    let material = new MeshBasicMaterial({color: 0Xc9b92b});

    this.cube1 = new Mesh(geometry, material);
    this.cube1.position.z = -6;
    this.cube1.position.y = -5;

    geometry = new BoxGeometry(5, 5, 5);
    material = new MeshBasicMaterial({color: 0Xff0040, transparent:true, opacity: 0.5});

    this.cube2 = new Mesh(geometry, material);
    this.cube2.position.z = 6;
    this.cube2.position.y = -5;

    let planegeometry = new PlaneGeometry(1000, 1000, 50, 50);
    material = new MeshBasicMaterial({color: 0Xa6f995, wireframe: true});

    this.plane = new Mesh(planegeometry, material);
    this.plane.rotation.x = Math.PI / 2;
    this.plane.position.y = -100;

    this.scene.add(this.cube1);
    this.scene.add(this.cube2);
    this.scene.add(this.plane);


  }

  private createAxes() {
    this.axes = new AxesHelper(15);
    this.scene.add(this.axes);
  }
}
