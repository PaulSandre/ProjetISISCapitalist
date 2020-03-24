import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { Product } from '../world';


declare var require;
var ProgressBar = require('progressbar.js');

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
  @ViewChild('bar') progressBarItem: ElementRef;
  lastupdate: number;
  server: string = 'http://localhost:8080/';
  isRun: boolean;
  bar: any;
  progress: any;
  product: Product;

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  //on récupère les gains du joueur 
  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
  }


  constructor() { }


  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.bar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
      strokeWidth: 4,
      easing: 'easeInOut',
      duration: 1400,
      color: '#FFEA82',
      trailColor: '#eee',
      trailWidth: 1,
      svgStyle: { width: '100%', height: '100%' }
    });
  }

  startFabrication() {
    this.bar.animate(1, { duration: this.product.vitesse });
    this.product.timeleft = this.product.vitesse;
    this.lastupdate = Date.now();
    this.isRun = true;
    console.log('test2');
  }


}



