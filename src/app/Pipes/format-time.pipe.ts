import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(time: string): string {
    if (!time) return '';

    let [hours, minutes] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // La hora '0' debe ser '12'

    const strHours = hours < 10 ? '0' + hours : hours.toString();
    const strMinutes = minutes < 10 ? '0' + minutes : minutes.toString();

    return `${strHours}:${strMinutes} ${ampm}`;
  }

}
