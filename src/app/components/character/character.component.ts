import { Component, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { ThreeService } from '../../services/three.service';

@Component({
  selector: 'app-character',
  standalone: true,
  imports: [],
  template: '<div></div>',
})
export class CharacterComponent implements OnInit {
  ngOnInit(): void {
    console.log('awdwa');
    this.createCharacter();
  }

  constructor(private readonly threeService: ThreeService) {}

  private character!: THREE.Group<THREE.Object3DEventMap>;
  private actions: THREE.AnimationAction[] = [];
  private glft!: GLTF;
  private mixer!: THREE.AnimationMixer;
  private clock!: THREE.Clock;
  private speed: number = 0.02;
  private msTimeout: number = 1000;
  private isWaiting: boolean = false;

  createCharacter() {
    // Create a clock to track time for animations
    this.clock = new THREE.Clock();

    const loader = new GLTFLoader();
    loader.load('../../assets/models/toon_cat_free.glb', (gltf) => {
      this.character = gltf.scene;
      this.character.scale.set(0.004, 0.004, 0.004); // Adjust the size of the model if needed
      this.character.position.set(0, 0, 6.8); // Position the character in the scene
      this.character.rotation.y = Math.PI / 2;

      // Create an AnimationMixer to handle animations
      this.mixer = new THREE.AnimationMixer(this.character);

      // Go through each animation in the GLTF file and add it to the mixer
      gltf.animations.forEach((clip: THREE.AnimationClip) => {
        const action = this.mixer.clipAction(clip);
        // store action clip animation
        this.actions.push(action);
      });

      // Start playing the animation
      this.actions[0].play();

      // Add character
      this.threeService.addObject(this.character);
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
    if (this.character && !this.isWaiting) {
      // Move the character back and forth
      this.character.position.x += this.speed; // Oscillates between -2 and 2

      // Get position x of the character
      const positionX = this.character.position.x;

      if (positionX >= 7 || positionX <= -6.2) {
        this.isWaiting = true;

        this.actions[0].reset().fadeIn(0.5).play();

        setTimeout(() => {
          this.isWaiting = false;
          this.character.rotation.y =
            this.speed > 0 ? Math.PI * 3.5 : Math.PI / 2;
          this.speed = this.speed * -1;
        }, this.msTimeout);
      }
    }

    this.threeService
      .getRenderer()
      .render(this.threeService.getScene(), this.threeService.getCamera());
  }
}
