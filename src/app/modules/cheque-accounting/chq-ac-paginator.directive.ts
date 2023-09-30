import { Directive, OnInit, Optional, Output, EventEmitter } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Directive({
  selector: '[appChqAcPaginator]',
  exportAs: '[appChqAcPaginator]'
})
export class ChqAcPaginatorDirective implements OnInit {
  @Output() paginatorLoadedData: EventEmitter<MatPaginator> = new EventEmitter<MatPaginator>();

  constructor(
    @Optional() private sort: MatSort,
    @Optional() private table: MatTable<any>,
    @Optional() private paginator: MatPaginator
  ) { }

  ngOnInit() {
    setTimeout(() => {
      if (this.table && this.sort) {
        (this.table.dataSource as any).sort = this.sort;
      }
      if (this.paginator) {
        this.paginatorLoadedData.emit(this.paginator);
      }
    }, 0);
  }
}
