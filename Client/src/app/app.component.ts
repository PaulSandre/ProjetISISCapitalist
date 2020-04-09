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
  dispoUpgrad: boolean;
  dispoAngel: boolean;
  addAngels = 0;

  @ViewChildren(ProductComponent) public productComponent: QueryList<ProductComponent>;
  @ViewChild('bar') progressbar: any;

 
 
  constructor(private service: RestserviceService, private notifyService: NotificationService) {
    this.server = 'http://localhost:8080/';
    this.createUsername();
    service.getWorld().then(world => {
      console.log(world);
      console.log(world.score)
      this.world = world;
    });

  }

  ngOnInit(): void {
    //sauvegarder le monde 
    setInterval(() => {
      this.disponibiliteManager();
      this.disponibiliteUpgrades();
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

  disponibiliteUpgrades() {
    this.dispoUpgrad = false;
    this.world.upgrades.pallier.map(upgrade => {
      if (!this.dispoUpgrad) {
        if (!upgrade.unlocked && this.world.money > upgrade.seuil) {
          this.dispoUpgrad = true
        }
      }
    })
  }

  //on test la disponibité la disponibilité des angels
  disponibiliteAngels() {
    this.dispoAngel = false;
    this.world.angelupgrades.pallier.map(angel => {
      if (!this.dispoUpgrad) {
        if (!angel.unlocked && this.world.activeangels > angel.seuil) {
          this.dispoAngel = true
        }
      }
    })
  }

  onProductionDone(p: Product) {
    this.world.money = this.world.money + p.quantite * p.revenu * (1 + (this.world.activeangels * this.world.angelbonus / 100));
    this.world.score = this.world.score + p.quantite * p.revenu * (1 + (this.world.activeangels * this.world.angelbonus / 100));
    this.addAngels = Math.round((150 * Math.sqrt(this.world.score / Math.pow(10, 15)))-this.world.totalangels);
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

    achatUpgrade(p: Pallier) {
      if (this.world.money > p.seuil) {
        this.world.money = this.world.money - p.seuil;
        this.world.upgrades.pallier[this.world.upgrades.pallier.indexOf(p)].unlocked = true;
        //si l'idcible est de 0, on applique l'upgrade sur tous les produits, sinon on recherche le produit concerné
        if (p.idcible == 0) {
          this.productComponent.forEach(prod => prod.calcUpgrade(p));
          this.notifyService.showSuccess("achat d'un upgrade de " + p.typeratio + " pour tous les produits", "Upgrade global");
        }
        else {
          this.productComponent.forEach(prod => {
            if (p.idcible == prod.product.id) {
              prod.calcUpgrade(p);
              this.notifyService.showSuccess("achat d'un upgrade de " + p.typeratio + " pour " + prod.product.name, "Upgrade")
            }
          })
        }
        //signaler l'achat d'un upgrade au serveur 
        this.service.putUpgrade(p);
      }
    }

    achatAngel(p: Pallier) {
      if (this.world.activeangels > p.seuil) {
        this.world.activeangels -= p.seuil;
        this.world.angelupgrades.pallier[this.world.angelupgrades.pallier.indexOf(p)].unlocked = true;
        if (p.typeratio == "ange") {
          this.world.money = this.world.money * p.ratio + this.world.money;
          this.world.score = this.world.score * p.ratio + this.world.score;
          this.notifyService.showSuccess("achat d'un upgrade de " + p.typeratio + " pour tous les produits", "Upgrade Angels")
        }
        //au cas ou c'est pas un upgrade de type ange
        else {
          //au cas ou c'est un upgrade global
          if (p.idcible = 0) {
            this.productComponent.forEach(prod => prod.calcUpgrade(p));
            this.notifyService.showSuccess("achat d'un upgrade de " + p.typeratio + " pour tous les produits", "Upgrade Angels");
          }
          //au cas ou c'est ciblé pour un produit
          else {
            this.productComponent.forEach(prod => {
              if (p.idcible == prod.product.id) {
                prod.calcUpgrade(p);
                this.notifyService.showSuccess("achat d'un upgrade de " + p.typeratio + " pour " + prod.product.name, "Upgrade Angels")
              }
            })
  
          }
        }
        console.log(this.world.totalangels,this.world.activeangels);
        this.service.putAngel(p);
      }
    }
  

    claimAngel(): void {
      this.service.deleteWorld();
      this.service.getWorld().then(world => {
        this.world = world;
      });
    }
  

    
  
}