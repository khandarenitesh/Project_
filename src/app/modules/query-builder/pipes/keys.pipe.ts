import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value: any, args?: any[]): any[] {
    return Object.keys(value);
  }
}

@Pipe({ name: 'values' })
export class ValuesPipe implements PipeTransform {
  transform(value: any, args?: any[]): any[] {
    return Object.values(value);
  }
}
