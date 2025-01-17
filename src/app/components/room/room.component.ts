import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';

// @ts-ignore
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { ThreeService } from '../../services/three.service';
import { CharacterComponent } from '../character/character.component';

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [CharacterComponent],
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
})
export class RoomComponent implements OnInit {
  @ViewChild('rendererContainer', { static: true })
  rendererContainer!: ElementRef;

  private orbitControls!: OrbitControls;

  constructor(private readonly threeService: ThreeService) {}

  ngOnInit(): void {
    this.initThreeJS();
  }

  initThreeJS(): void {
    // Scene
    const scene = new THREE.Scene();
    this.threeService.setScene(scene);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(9, 8, 12);
    this.threeService.setCamera(camera);

    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff); // Soft light
    this.threeService.addObject(ambientLight);

    // Point Light
    const pointLight = new THREE.PointLight(0xffffff, 125); // Soft light
    pointLight.position.set(0, 5, 0);
    this.threeService.addObject(pointLight);

    // Point Light Helper
    const pointLightHelper = new THREE.PointLightHelper(pointLight);
    this.threeService.addObject(pointLightHelper);

    // Grid
    const gridHelper = new THREE.GridHelper(200, 50);
    this.threeService.addObject(gridHelper);

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.rendererContainer.nativeElement.appendChild(renderer.domElement);
    this.threeService.setRenderer(renderer);

    // Orbit Controls
    this.orbitControls = new OrbitControls(
      this.threeService.getCamera(),
      this.threeService.getRenderer().domElement
    );

    this.createScenario();

    this.animate();
  }

  createScenario() {
    // Add floor
    const floorGeometry = new THREE.PlaneGeometry(15, 15);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Make it horizontal
    floor.position.y = 0;
    this.threeService.addObject(floor);

    // Add wall 1
    const wallGeometry = new THREE.PlaneGeometry(15, 6);
    const wallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x7a8ddf,
      // DoubleSide: Makes the wall visible on both sides
      side: THREE.DoubleSide,
    });
    const wall1 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall1.position.set(0, 3, -7.5); // Position it at the back
    this.threeService.addObject(wall1);

    // Add wall 2
    const wall2 = new THREE.Mesh(wallGeometry, wallMaterial);
    wall2.rotation.y = Math.PI / 2; // Rotate to make it vertical
    wall2.position.set(-7.5, 3, 0); // Position it to the left
    this.threeService.addObject(wall2);
  }

  animate(): void {
    requestAnimationFrame(() => this.animate());

    // Render the scene
    this.threeService
      .getRenderer()
      .render(this.threeService.getScene(), this.threeService.getCamera());
  }
}
