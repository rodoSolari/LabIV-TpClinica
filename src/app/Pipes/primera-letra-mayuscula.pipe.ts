import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'primeraLetraMayuscula'
})
export class PrimeraLetraMayusculaPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    return value.replace(/\b\w/g, first => first.toLocaleUpperCase());
  }

}
