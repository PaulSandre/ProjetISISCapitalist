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
    this.world.money = this.world.money + p.revenu;
    this.world.score = this.world.score + 1;
  }
  
}