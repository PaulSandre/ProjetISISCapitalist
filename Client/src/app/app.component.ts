import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ProductComponent } from './product/product.component'
import { NotificationService } from './notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ISISCapitalist';
  username: string = '';
  world: World = new World();
  server: string;
  qtmulti: number = 1;
  dispoManager: boolean;

  @ViewChildren(ProductComponent) public productComponent: QueryList<ProductComponent>;
  @ViewChild('bar') progressbar: any;

 
 
  constructor(private service: RestserviceService, private notifyService: NotificationService) {
    this.server = 'http://localhost:8080/';
    this.createUsername();
    service.getWorld().then(world => {
      console.log(world);
      this.world = world;
    });

  }

  ngOnInit(): void {
    //sauvegarder le monde 
    setInterval(() => {
      this.disponibiliteManager();
      this.bonusAllunlock()
    }, 1000);
  }

  disponibiliteManager(): void {
    this.dispoManager = false;
    this.world.managers.pallier.forEach(val => {
      if (!this.dispoManager) {
        if (this.world.money > val.seuil && !val.unlocked) {
          this.dispoManager = true;
        }
      }
    })
  }

  onProductionDone(p: Product) {
    this.world.money = this.world.money + p.quantite * p.revenu ;
    this.world.score = this.world.score + p.quantite * p.revenu ;
  }

  commutateur() {
    switch (this.qtmulti) {
      case 1:
        this.qtmulti = 10
        break;
      case 10:
        this.qtmulti = 100
        break;
      case 100:
        this.qtmulti = 100000
        break;
      default:
        this.qtmulti = 1
    }
  }

    

    achatManager(m: Pallier) {
      if (this.world.money >= m.seuil) {
        this.world.money = this.world.money - m.seuil;
  
        this.world.managers.pallier[this.world.managers.pallier.indexOf(m)].unlocked = true;
  
        this.world.products.product.forEach(element => {
          if (m.idcible == element.id) {
            this.world.products.product[this.world.products.product.indexOf(element)].managerUnlocked = true;
          }
        });
        this.notifyService.showSuccess("Achat de " + m.name + " effectué", "Manager")
        this.service.putManager(m);

      
      }
      
    }

    onNotifyAchat(produit:Product){
      this.service.putProduit(produit);
    }

    onNotifyPurchase(data : number) {
      this.world.money -= data;
    }

    onUsernameChanged(): void {
      localStorage.setItem("username", this.username);
      this.service.setUser(this.username);
    }
    //ici on crée le nom d'utilisateur s'il n'exite pas et l'enregistre dans le serveur
    createUsername(): void {
      this.username = localStorage.getItem("username");
      if (this.username == '') {
        this.username = 'Captain' + Math.floor(Math.random() * 10000);
        localStorage.setItem("username", this.username);
      }
      this.service.setUser(this.username);
    }

    bonusAllunlock() {
      //on recherche la quantité minmal des produits
      let minQuantite = Math.min(
        ...this.productComponent.map(p => p.product.quantite)
      )
      this.world.allunlocks.pallier.map(value => {
        //si la quantité minimal dépasse le seuil, on débloque le produit concerné
        if (!value.unlocked && minQuantite >= value.seuil) {
          this.world.allunlocks.pallier[this.world.allunlocks.pallier.indexOf(value)].unlocked = true;
          this.productComponent.forEach(prod => prod.calcUpgrade(value))
          this.notifyService.showSuccess("Bonus de " + value.typeratio + " effectué sur tous les produits", "Unlock");
        }
      })
    }

    
  
}