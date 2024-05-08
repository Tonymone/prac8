import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page {
  @ViewChild('video') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement!: ElementRef<HTMLCanvasElement>;

  capturedImages: string[] = [];
  showCamera: boolean = false;
  showGallery: boolean = false;
  showButtonsAtTop: boolean = false;
  showCameraControls: boolean = false;
  oopenCamera: boolean = true;

  constructor() {}

  openCamera() {
    this.oopenCamera = false;
    this.showCameraControls = true;
    this.showCamera = true;
    this.showGallery = false;
    this.showButtonsAtTop = true;
    this.initializeCamera();
    this.capturedImages = [];
  }

  openGallery() {
    this.showGallery = true;
    // this.showCamera = false;
    this.showButtonsAtTop = false;
  }

  initializeCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.videoElement.nativeElement.srcObject = stream;
      })
      .catch(err => console.error(err));
  }

  captureImage() {
    const canvas = this.canvasElement.nativeElement;
    canvas.width = this.videoElement.nativeElement.videoWidth;
    canvas.height = this.videoElement.nativeElement.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(this.videoElement.nativeElement, 0, 0);
    }
    const capturedImage = canvas.toDataURL('image/png');
    this.capturedImages.push(capturedImage);
  }

  closeCamera() {
    this.showCamera = false;
    this.oopenCamera = true;
    this.stopVideo();
  }

  stopVideo() {
    if (this.videoElement && this.videoElement.nativeElement) {
      this.videoElement.nativeElement.pause();
      this.videoElement.nativeElement.srcObject = null;
    }
  }

  selectFromGallery(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files) {
      const files = Array.from(target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.capturedImages.push(reader.result as string);
        }
        reader.readAsDataURL(file);
      });
    }
  }

  deleteImage(index: number) {
    this.capturedImages.splice(index, 1);
  }
}
