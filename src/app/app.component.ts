import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;

  title = 'ThreeJsExperiment';

  ngOnInit(): void {
    this.initThreeJS();
  }

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private ambientLight!: THREE.AmbientLight;
  private pointLight!: THREE.PointLight;
  private gridHelper!: THREE.GridHelper;
  private orbitControls!: OrbitControls;
  private cube!: THREE.Mesh;

  initThreeJS(): void {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 12;
    this.camera.position.y = 8;
    this.camera.position.x = 9;

    // Ambient Light
    this.ambientLight = new THREE.AmbientLight(0xffffff); // Soft light
    //this.scene.add(this.ambientLight);

    // Point Light
    this.pointLight = new THREE.PointLight(0xffffff, 125); // Soft light
    this.pointLight.position.set(0, 6, 0);
    this.scene.add(this.pointLight);

    // Point Light Helper
    const pointLightHelper = new THREE.PointLightHelper(this.pointLight);
    this.scene.add(pointLightHelper);

    // Grid
    this.gridHelper = new THREE.GridHelper(200, 50);
    this.scene.add(this.gridHelper);

    // Renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(this.renderer.domElement);

    // Orbit Controls
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );

    // Add a Cube
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.y = 0;
    this.scene.add(this.cube);
    this.addScenario();

    // Handle resizing
    // window.addEventListener('resize', this.onWindowResize.bind(this));

    this.animate();
  }

  addScenario() {
    // Add floor
    const floorGeometry = new THREE.PlaneGeometry(15, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Make it horizontal
    floor.position.y = 0;
    this.scene.add(floor);

    // Add wall 1
    const wallGeometry = new THREE.PlaneGeometry(15, 6);
    const wallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7a8ddf,
      // DoubleSide: Makes the wall visible on both sides
      side: THREE.DoubleSide,
    });
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(0, 3, -7.5); // Position it at the back
    this.scene.add(wall1);

    // Add wall 2
    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.rotation.y = Math.PI / 2; // Rotate to make it vertical
    wall2.position.set(-7.5, 3, 0); // Position it to the left
    this.scene.add(wall2);
  }

  onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    // Rotate the cube
    // this.cube.rotation.x += 0.01;
    // this.cube.rotation.y += 0.01;

    // Render the scene
    this.renderer.render(this.scene, this.camera);
  }
}
