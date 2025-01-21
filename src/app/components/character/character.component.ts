import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
// @ts-ignore
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { ThreeService } from '../../services/three.service';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [],
  template: '<div></div>',
})
export class CharacterComponent implements OnInit {
  ngOnInit(): void {
    this.createModel();
  }

  constructor(private readonly threeService: ThreeService) {}

  private model!: THREE.Group<THREE.Object3DEventMap>; // 3D model
  private actions: THREE.AnimationAction[] = [];
  private mixer!: THREE.AnimationMixer;
  private clock!: THREE.Clock;
  private speed: number = 0.02;
  private msTimeout: number = 1000;
  private isWaiting: boolean = false;

  createModel() {
    // Create a clock to track time for animations
    this.clock = new THREE.Clock();

    const loader = new GLTFLoader();
    loader.load('../../assets/models/gltf/toon_cat.glb', (gltf: any) => {
      this.model = gltf.scene;
      this.model.scale.set(0.004, 0.004, 0.004); // Adjust the size of the model if needed
      this.model.position.set(0, 0, 6.8); // Position the character in the scene
      this.model.rotation.y = Math.PI / 2;

      // Create an AnimationMixer to handle animations
      this.mixer = new THREE.AnimationMixer(this.model);

      // Go through each animation in the GLTF file and add it to the mixer
      gltf.animations.forEach((clip: THREE.AnimationClip) => {
        const action = this.mixer.clipAction(clip);
        // store action clip animation
        this.actions.push(action);
      });

      // Start playing the animation
      this.actions[0].play();

      // Add character
      this.threeService.addObject(this.model);
    });
    this.animate();
  }

  // Render loop
  animate() {
    requestAnimationFrame(() => this.animate());

    // Update the animation mixer (progresses animations)
    if (this.mixer) {
      const delta = this.clock.getDelta();
      this.mixer.update(delta);
    }

    // Checks for character existence before starting animation
    if (this.model && !this.isWaiting) {
      // Move the character back and forth
      this.model.position.x += this.speed; // Oscillates between -2 and 2

      // Get position x of the character
      const positionX = this.model.position.x;

      if (positionX >= 7 || positionX <= -6.2) {
        this.isWaiting = true;

        this.actions[0].reset().fadeIn(0.5).play();

        setTimeout(() => {
          this.isWaiting = false;
          this.model.rotation.y = this.speed > 0 ? Math.PI * 3.5 : Math.PI / 2;
          this.speed = this.speed * -1;
        }, this.msTimeout);
      }
    }

    this.threeService.render();
  }
}
