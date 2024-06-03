import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ZoomableImageComponent} from "./components/zoomable-image/zoomable-image.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ZoomableImageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'img-zoom';
}
