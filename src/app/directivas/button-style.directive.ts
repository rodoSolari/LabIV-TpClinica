import { Directive, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appButtonStyle]'
})
export class ButtonStyleDirective implements OnInit  {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.applyDefaultStyles();
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.changeHoverStyles();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.applyDefaultStyles();
  }

  private applyDefaultStyles() {
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#007bff');
    this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    this.renderer.setStyle(this.el.nativeElement, 'border', 'none');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '10px 20px');
    this.renderer.setStyle(this.el.nativeElement, 'cursor', 'pointer');
    this.renderer.setStyle(this.el.nativeElement, 'marginTop', '10px');
  }
  private changeHoverStyles() {
    const classes = this.el.nativeElement.classList;
    if (classes.contains('btn-info')) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#17a2b8');
      this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    } else if (classes.contains('btn-success')) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#28a745');
      this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    } else if (classes.contains('btn-primary')) {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#007bff');
      this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    }
      else if (classes.contains('btn-danger')) {
        this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#dd1212');
        this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    } else {
      this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#0056b3');
      this.renderer.setStyle(this.el.nativeElement, 'color', 'white');
    }
  }

}
