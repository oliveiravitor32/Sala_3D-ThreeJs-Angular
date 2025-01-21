import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class ThreeService {
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public setRenderer(renderer: THREE.WebGLRenderer) {
    this.renderer = renderer;
  }

  public getScene(): THREE.Scene {
    return this.scene;
  }

  public setScene(scene: THREE.Scene) {
    this.scene = scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public setCamera(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  public addObject(object: any): void {
    this.scene.add(object);
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  constructor() {}
}
