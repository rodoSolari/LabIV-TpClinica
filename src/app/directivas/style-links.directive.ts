import { Directive, ElementRef, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStyleLinks]'
})
export class StyleLinksDirective implements OnInit {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    const anchors = this.el.nativeElement.querySelectorAll('a');
    anchors.forEach((anchor: HTMLElement) => {
      this.renderer.setStyle(anchor, 'color', 'white');
      this.renderer.setStyle(anchor, 'margin-left', '10px');
      this.renderer.setStyle(anchor, 'border', '1px solid black');

    this.renderer.listen(anchor, 'mouseover', () => {
      this.renderer.setStyle(anchor, 'backgroundColor', 'lightgray');
      this.renderer.setStyle(anchor, 'color', 'black');
    });

    this.renderer.listen(anchor, 'mouseout', () => {
      this.renderer.setStyle(anchor, 'backgroundColor', 'transparent');
      this.renderer.setStyle(anchor, 'color', 'white');
      });
    });
  }
}
