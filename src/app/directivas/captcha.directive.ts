import { Directive, ElementRef, EventEmitter, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCaptcha]'
})
export class CaptchaDirective implements OnInit{

  @Output() captchaGenerated = new EventEmitter<string>();

  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngOnInit() {
    this.renderCaptcha();
  }

  renderCaptcha() {
    const captchaText = this.generateCaptchaText();
    this.renderer.setProperty(this.el.nativeElement, 'innerText', captchaText);
    this.captchaGenerated.emit(captchaText);
    console.log('Captcha generated and emitted: ', captchaText);

    this.renderer.setStyle(this.el.nativeElement, 'display', 'inline-block');
    this.renderer.setStyle(this.el.nativeElement, 'padding', '10px');
    this.renderer.setStyle(this.el.nativeElement, 'border', '1px solid #ccc');
    this.renderer.setStyle(this.el.nativeElement, 'margin-bottom', '10px');
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#f9f9f9');
  }

  generateCaptchaText(): string {
    return Math.random().toString(36).substring(2, 8);
  }
}
