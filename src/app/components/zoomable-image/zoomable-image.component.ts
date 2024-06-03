import {AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {NgOptimizedImage, NgStyle} from "@angular/common";

@Component({
  selector: 'app-zoomable-image',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgStyle
  ],
  templateUrl: './zoomable-image.component.html',
  styleUrl: './zoomable-image.component.css'
})
export class ZoomableImageComponent implements OnInit, AfterViewInit {
  @Input() maxScale = 5;
  @Input() factor = 0.1;
  @ViewChild('zoomTarget', {static: true}) target!: ElementRef<HTMLDivElement>;
  @ViewChild('img', {static: true}) img!: ElementRef<HTMLImageElement>;
  outsideImg = {
    x: {
      left: 0,
      right: 0
    },
    y: {
      left: 0,
      right: 0
    }
  }
  targetTranslation = {x: 0, y: 0};
  scale = 1;
  private lastMousePosition = {x: 0, y: 0};
  private dragStarted = false;
  constructor(private _elementRef:ElementRef) {
  }
  ngOnInit(): void {
  }

  @HostListener('wheel', ['$event'])
  onWheel(event: WheelEvent): void {
    this.scrolled(event);
  }

  private scrolled(event: WheelEvent): void {
    event.preventDefault();
    let delta = -Math.sign(event.deltaY);
    const zoomPosition = {
      x: 0,
      y: 0
    }
    zoomPosition.x = (event.offsetX - this.targetTranslation.x) / this.scale;
    zoomPosition.y = (event.offsetY - this.targetTranslation.y) / this.scale;
    const scale = this.scale + delta * this.factor;
    this.scale = Math.max(0.25, Math.min(this.maxScale, scale));

    this.targetTranslation.x = event.offsetX - zoomPosition.x * this.scale;
    this.targetTranslation.y = event.offsetY - zoomPosition.y * this.scale;
    this._update();
  }

  moved(event: MouseEvent): void {
    if (this.dragStarted) {
      const currentMousePosition = {x: event.pageX, y: event.pageY};
      const changeX = currentMousePosition.x - this.lastMousePosition.x;
      const changeY = currentMousePosition.y - this.lastMousePosition.y;

      this.lastMousePosition = currentMousePosition;
      this.targetTranslation.x += changeX;
      this.targetTranslation.y += changeY;

      this._update();
    }
  }

  startDrag(event: MouseEvent): void {
    if (this.dragStarted) {
      this.endDrag()
      return;
    }
    const target = this.target.nativeElement;
    this.dragStarted = true;
    target.style.cursor = 'move';
    this.lastMousePosition = {x: event.pageX, y: event.pageY};
  }

  endDrag(): void {
    this.dragStarted = false;
    const target = this.target.nativeElement;
    target.style.cursor = 'default';
  }

  private _update(): void {
    const target = this.target.nativeElement;
    const {offsetWidth: targetWidth, offsetHeight: targetHeight} = target

    if (this.targetTranslation.x > 0) {
      this.targetTranslation.x = 0;
    }
    if (this.targetTranslation.x < this.outsideImg.x.left || this.targetTranslation.x > this.outsideImg.x.right || this.targetTranslation.x + targetWidth * this.scale < targetWidth) {
      console.log(this.targetTranslation.x)
      console.log(this.targetTranslation.y)
      this.targetTranslation.x = -(targetWidth * (this.scale - 1))/2;
    }

    if (this.targetTranslation.y > 0) {
      this.targetTranslation.y = 0;
    }
    if (this.targetTranslation.y + targetHeight * this.scale < targetHeight) {
      this.targetTranslation.y = -(targetHeight * (this.scale - 1))/2;
    }
    this._updateOutSide()
  }

  ngAfterViewInit(): void {
    this._updateOutSide()
  }
  _updateOutSide(){
    const xOut = (this._elementRef.nativeElement?.offsetWidth - this.target.nativeElement.offsetWidth * this.scale) / 2;
    const yOut = (this._elementRef.nativeElement?.offsetHeight - this.target.nativeElement.offsetHeight * this.scale) / 2;
    this.outsideImg = {
      x: {
        left: xOut,
        right: xOut + this.target.nativeElement.offsetWidth
      },
      y: {
        left: yOut,
        right: yOut + this.target.nativeElement.offsetHeight
      }
    }
    console.log(this.outsideImg)
  }
}
