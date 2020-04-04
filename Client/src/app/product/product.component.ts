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
  coutAchat1 = 0;
  coutAchat2 = 0;
  cost = 0;
  cout = 0;
  coutAchat = 0;


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

    if (this.product) {

      //on initialise le coût d'achat
      this.maxAchat = this.product.cout;

      if (this.product.managerUnlocked && this.product.timeleft > 0) {
        this.lastupdate = Date.now();
       this.progress = (this.product.vitesse - this.product.timeleft) / this.product.vitesse;
        this.bar.animate(1, { duration: this.progress });
      }
    }
  }

  _money: number;
  @Input()
  set money(value: number) {
    this._money = value;
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() notifyMoney: EventEmitter<number> = new EventEmitter<number>();
  @Output() notifyAchat: EventEmitter<Product> = new EventEmitter<Product>();


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
        easing: 'linear',
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
      // si le produit n'est pas déjà en production
      if (this.product.timeleft == 0 && !this.product.managerUnlocked) {
        this.lastupdate = Date.now()
        this.product.timeleft = this.product.vitesse;
        this.bar.animate(1, { duration: this.product.timeleft });
        console.log("production")

      }
    }
  }

  calcScore() {
    if (this.product) {
      if (this.product.timeleft > 0) {
        this.product.timeleft = this.product.timeleft - (Date.now() - this.lastupdate);
        this.lastupdate = Date.now();
        this.bar.animate(1, { duration: this.product.timeleft });
        if (this.product.timeleft <= 0) {
          this.product.timeleft = 0;
          this.notifyProduction.emit(this.product);
          // on remet à 0 la bar quand le temps est à 0
          this.bar.set(0);
          if (this.product.managerUnlocked) {
            this.product.timeleft = this.product.vitesse;
            try {
              this.bar.animate(1, { duration: this.product.vitesse })
            }
            catch (ex) { }
          }
        }
      }
      else {
        if (this.product.managerUnlocked) {
          this.product.timeleft = this.product.vitesse;
        }
      }
    }
  }

  //Calcul de la quantité maxium de produit que l'on peut acheter 
  calcMaxCanBuy(): number {
    this.cost = this.CoutIndiv();
    //console.log("cout d'un prod"+this.cost);
    let maxCanBuy = 0;
    //on part du n-ieme produit jusqu'au maximum qu'on peut acheter
    //console.log("cout de l'obj"+this.cost);
    // console.log("money : "+this.money);
    while (this.cost <= this._money) {
      this.cost = this.cost + this.product.cout * this.product.croissance ** (this.product.quantite + maxCanBuy + 1);
      maxCanBuy += 1;

    }
    return maxCanBuy;
  }

  //Calcul du cout du n-ieme produit
  CoutIndiv() {
    this.coutAchat1 = 0;
    this.coutAchat2 = 0;
    //console.log("qtité : "+this.product.quantite);
    if (this.product) {
      for (let y = 0; y <= this.product.quantite; y++) {
        this.coutAchat1 = this.coutAchat1 + this.product.cout * this.product.croissance ** (y);
      }
      for (let z = 0; z <= this.product.quantite - 1; z++) {
        this.coutAchat2 = this.coutAchat2 + this.product.cout * this.product.croissance ** (z);
      }
      let coutIndiv = this.coutAchat1 - this.coutAchat2;
      return coutIndiv;
    }
  }

  //Calcul du coup d'achat d'un produit
  achatProduct() {
    this.coutAchat2 = 0;
    if (this._qtmulti <= this.calcMaxCanBuy()) {
      for (let y = 0; y < this.product.quantite; y++) {
        this.coutAchat = this.coutAchat + this.product.cout * this.product.croissance ** (y);
      }
      this.cout = this.coutAchat;
      // cout de la nouvelle demande (x1,x10,x100,max) + cout de l'ancienne
      for (let i = this.product.quantite; i < this._qtmulti + this.product.quantite; i++) {
        this.cout = this.cout + this.product.cout * this.product.croissance ** (i);
      }
      //calcul du cout de la nouvelle demande
      let EmissionCout = this.cout - this.coutAchat;
      //calcul de la nouvelle quantite
      this.product.quantite = this.product.quantite + this._qtmulti;
      this.notifyMoney.emit(EmissionCout);
    }
  }

}



