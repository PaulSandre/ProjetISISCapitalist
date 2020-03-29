import { Component, ViewChild } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ISISCapitalist';
  world: World = new World();
  server: string;

  @ViewChild('bar') progressbar: any;

 
 
  constructor(private service: RestserviceService, private http: HttpClient, ) {
    this.server = service.getServer();
    service.getWorld().then(

      world => {
        this.world = world;
      });
  }

  onProductionDone(p: Product) {
    this.world.money = this.world.money + p.quantite * p.revenu * (1 + (this.world.activeangels * this.world.angelbonus / 100));
    this.world.score = this.world.score + p.quantite * p.revenu * (1 + (this.world.activeangels * this.world.angelbonus / 100));
    this.world.totalangels = Math.round(this.world.totalangels + (150 * Math.sqrt(this.world.score / Math.pow(10, 15))));
  }
  
}