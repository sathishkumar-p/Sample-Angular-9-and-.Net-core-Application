import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-simpleaggrid',
  templateUrl: './simpleaggrid.component.html',
  styleUrls: ['./simpleaggrid.component.scss']
})
export class SimpleaggridComponent implements OnInit {

  columnDefs = [
    {headerName: 'Make', field: 'make', sortable: true, filter: true},
    {headerName: 'Model', field: 'model', sortable: true, filter: true},
    {headerName: 'Price', field: 'price', sortable: true, filter: true}
];

rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxter', price: 72000 }
];

  constructor() { }

  ngOnInit() {
  }

}
