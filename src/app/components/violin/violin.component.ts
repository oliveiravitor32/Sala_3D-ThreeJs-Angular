import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { ThreeService } from '../../services/three.service';

@Component({
  selector: 'app-violin',
  standalone: true,
  imports: [],
  template: '<div></div>',
})
export class ViolinComponent implements OnInit {
  ngOnInit(): void {
    this.createModel();
  }

  constructor(private readonly threeService: ThreeService) {}

  private model!: THREE.Group<THREE.Object3DEventMap>; // 3D model

  createModel() {
    const loader = new GLTFLoader();
    loader.load('../../assets/models/gltf/violin.glb', (gltf: any) => {
      this.model = gltf.scene;
      this.model.scale.set(0.1, 0.1, 0.1); // Adjust the size of the model if needed
      this.model.position.set(-7.1, 0, 2); // Position the character in the scene
      this.model.rotation.y = Math.PI / 2;

      this.threeService.addObject(this.model);
    });
    this.animate();
  }

  // Render loop
  animate() {
    requestAnimationFrame(() => this.animate());
    this.threeService.render();
  }
}
