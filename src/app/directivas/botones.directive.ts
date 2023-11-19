import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[appBotones]'
})
export class BotonesDirective implements OnInit {

  constructor(private element : ElementRef) { }

  ngOnInit(): void {
    this.estiloBoton();
  }

  private estiloBoton(){
    this.element.nativeElement.setAttribute(
      'style','display : inline; border-radius : 15px;'
    )

  }

}
