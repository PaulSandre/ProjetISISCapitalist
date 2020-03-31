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
  _qtmulti: number;
  maxAchat: number;

  @Input()
  set qtmulti(value: number) {
    if (value >= 100000) {
      this._qtmulti = this.calcMaxCanBuy();
    }
    else {
      this._qtmulti = value;
    }
  }

  @Input()
  set prod(value: Product) {
    this.product = value;

    //on initialise le coût d'achat
    this.maxAchat = this.product.cout;

    if (this.product.managerUnlocked && this.product.timeleft > 0) {
      this.lastupdate = Date.now();
      this.progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
      this.bar.animate(1, { duration: this.progress });
    }
  }

  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() notifyMoney: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }


  ngOnInit(): void {
    setInterval(() => {
      this.calcScore();
    }, 100);
  }


  ngAfterViewInit() {
    setTimeout(() => {
      this.bar = new ProgressBar.Line(this.progressBarItem.nativeElement, {
        strokeWidth: 4,
        easing: 'easeInOut',
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: { width: '100%', height: '100%' },
        from: { color: '#FFEA82' },
        to: { color: '#ED6A5A' },
        step: (state, bar) => {
          bar.path.setAttribute('stroke', state.color);
        }
      });
    }, 100)

  }

  startFabrication() {
    if (this.product.quantite >= 1) {
      this.progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
      this.bar.animate(1, { duration: this.progress });
      this.product.timeleft = this.product.vitesse;
      this.lastupdate = Date.now();
      this.isRun = true;
      console.log('test2');
    }
  }

  calcScore() {
    if (this.isRun) {
      if (this.product.timeleft > 0) {
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
      }
      else {
        this.product.timeleft = 0;
        this.lastupdate = 0;
        this.isRun = false;
        this.bar.set(0);
      }
      this.notifyProduction.emit(this.product);
    }
    if (this.product.managerUnlocked) {
      this.startFabrication();
    }
  }

  calcMaxCanBuy(): number {
    let quantiteMax: number = 0;
    if(this.product.cout*this.product.croissance <= this._money){
      let calPrelem = (this.product.cout - (this._money*(1-this.product.croissance)))/this.product.cout;
      let quant = (Math.log(calPrelem))/Math.log(this.product.croissance);
      quantiteMax = Math.trunc(quant-1);
      if(isNaN(quantiteMax)){
        quantiteMax = 0;
      }
      
    }
    return quantiteMax;
  }

  achatProduct() {
    
    if (this._qtmulti <= this.calcMaxCanBuy()) {
      var coutAchat = 0;
      for(let i=0;i<this._qtmulti;i++){
        this.maxAchat = this.maxAchat*this.product.croissance;
        coutAchat = coutAchat + this.maxAchat;
      }
      this.notifyMoney.emit(coutAchat);
      this.product.quantite = this.product.quantite + this._qtmulti;
    }
  }

  




}



