import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[sqlQueryValidator]'
})
export class SqlQueryValidatorDirective {
  private pattern: RegExp = /^(\s*(SELECT|UPDATE|DELETE|INSERT INTO|CREATE|ALTER|DROP|TRUNCATE|WITH|FROM|JOIN|WHERE|GROUP BY|HAVING|ORDER BY|LIMIT|OFFSET|AND|OR|NOT|IN|BETWEEN|LIKE|IS NULL|IS NOT NULL|AS|ON|CASE|WHEN|THEN|ELSE|END|IN|ASC|DESC|ALL|DISTINCT|UNION|EXCEPT|INTERSECT)[\s\S]*)$/i;

  @Output() sqlQueryValid: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private el: ElementRef) { }

  @HostListener('input')
  onInput() {
    const inputValue: string = this.el.nativeElement.value;
    const isValid: boolean = this.pattern.test(inputValue);
    this.sqlQueryValid.emit(isValid);
  }
}
