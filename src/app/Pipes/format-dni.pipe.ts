import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDni'
})
export class FormatDniPipe implements PipeTransform {

  transform(value: number | string): string {
    if (!value) return '';

    const stringValue = value.toString();

    const cleanValue = stringValue.replace(/\D+/g, '');

    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

}
