import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {
  AxesHelper,
  BoxGeometry,
  Camera,
  Color, DoubleSide, Face3, FontLoader, Geometry, Material,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Renderer,
  Scene,
  SphereGeometry, TextGeometry, TorusGeometry, Vector3,
  WebGLRenderer
} from 'three';
import {jsondata} from '../font-dat';
import {star_war_font} from '../star-war-font';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  scene: Scene;
  camera: Camera;
  geometry: TextGeometry;
  loader: FontLoader;
  axes: AxesHelper;
  text: Mesh;

  renderer: Renderer;
  public fieldOfView = 60;
  public nearClippingPane = 1;
  public farClippingPane = 1000;
  ADD = 0.06;
  theta = 0;

  createFont() {
    this.loader = new FontLoader();
    let font = this.loader.parse(star_war_font);
    // let titles = 'The Lord shall bless the out of Zion, \n Jesus Christ, \n Halleujah, \n Praise the Lord, \n Thank you Jesus, \n Maranatha';
    let titles = 'Star wars : SV1.0 \n' +
      '\n' +
      'After the Star Wars : Last Jedi, \n' +
      'General Leia lost her hopes on Jedi, \n' +
      'because  of Luke Skywaker’s stubbornness.\n' +
      'Even thou General Leia is happy about Rey \n' +
      'in front of her, \n' +
      'she is totally jealous of her killer looks, \n' +
      'she is afraid all upcoming newly recruited \n' +
      'apprentice trained under Rey,\n' +
      ' will not listen to General Leia. \n' +
      'So after loosing all her kick ass weapons \n' +
      'like super laser beams \n' +
      'and flying aircraft carriers \n' +
      '(which was later stolen by avengers), General Leia \n' +
      'looks for left over options. \n' +
      'Following are the left over options:\n' +
      '    1. Facebook\n' +
      '    2. Instagram\n' +
      '    3. Twitter\n' +
      '    4. Google\n' +
      '    5. Chewbacca\n' +
      '    6. R2 - D2 \n'+
      '    7. Spare parts for broken aircraft\n'+
      '    6. And lots of lots of data scientists, \n' +
      'from United States of Ameerpet\n' +
      'Now she don’t want to data scientists \n' +
      'to be trained as Jedi \n' +
      '(to stop influence of Ray, because of \n' +
      'her killer looks and \n' +
      'she hardly find facebook followers and friends), \n' +
      'she find the the only hope for Resitance to \n' +
      'fight against the federation that is SV1.0 \n' +
      'aka Social Vantange 1.0. \n' +
      'And one day... story continues..\n';
      this.geometry = new TextGeometry(titles, {font: font, size: 3, height: 0.1});
    let material = new MeshBasicMaterial({color: 0xffffff});
    this.text = new Mesh(this.geometry, material);
    this.text.position.x = -25;
    this.text.rotation.x = -0.9;
    this.scene.add(this.text);
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
    this.createFont();
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
     this.camera.position.z = 30;
     this.camera.position.x = 2;
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
    this.text.position.z -= this.ADD;
    this.text.position.y += this.ADD / 2;
    this.renderer.render(this.scene, this.camera);
  }


  private createAxesHelper() {
    this.axes = new AxesHelper(5);
    this.scene.add(this.axes);
  }
}
