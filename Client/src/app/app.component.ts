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
  title = 'adventureisis';
  world: World = new World();
  server: string;
  compteur = 0;
  qtmulti = 1;
  gain: number;
  dispoManager: boolean;
  dispoUpgrad: boolean;
  dispoAngel: boolean;
  isRun = false;
  username: string = '';
  nvAnges = 0;
  @ViewChildren(ProductComponent) productsComponent: QueryList<ProductComponent>;


  constructor(private service: RestserviceService, private notifyService: NotificationService) {
    service.setUser(localStorage.getItem("username"));
    this.server = service.getServer();
    this.generationpseudo();
    service.getWorld().then(world => {
      this.world = world;
      this.estDispoManager();
      this.estDispoUpgrade();
      this.bonusAllunlock();
      this.estDispoUpgradeAngel();
      this.nvAnges = Math.round(150 * Math.sqrt(this.world.score / Math.pow(10, 15)));

    });
  }

  ngOnInit(): void {
    this.username = localStorage.getItem("username");
  }


  onProductionDone(p: Product) {
    //this.nvAnges=Math.round(150 * Math.sqrt(this.world.score / Math.pow(10, 15))-this.world.totalangels);
    this.nvAnges = Math.round(150 * Math.sqrt(this.world.score / Math.pow(10, 15)));
    this.gain = p.revenu * p.quantite * (1 + this.world.activeangels * this.world.angelbonus / 100);
    this.world.money = this.world.money + this.gain;
    this.world.score = this.world.score + this.gain;
    this.estDispoManager();
    this.estDispoUpgrade();
  }

  prodSSManager(p: Product) {
    this.service.putProduit(p);
  }

  onNotifyPurchase(c: number) {
    this.world.money = this.world.money - c;
    this.estDispoUpgrade();
    this.bonusAllunlock();
    this.estDispoManager();
  }


  onNotifyAchat(p: Product) {
    this.service.putProduit(p);
    this.gain = p.revenu * p.quantite * (1 + this.world.activeangels * this.world.angelbonus / 100);
    this.nvAnges = Math.round(150 * Math.sqrt(this.world.score / Math.pow(10, 15)));
  }

  estDispoManager() {
    this.dispoManager = false;
    this.world.managers.pallier.forEach(val => {
      if (this.dispoManager == false) {
        if (this.world.money >= val.seuil && val.unlocked == false) {
          this.dispoManager = true;
        }
      }
    })
  }
  estDispoUpgrade() {
    this.dispoUpgrad = false;
    this.world.upgrades.pallier.forEach(upg => {
      if (this.dispoUpgrad == false) {
        if (this.world.money >= upg.seuil && upg.unlocked == false) {
          this.dispoUpgrad = true;
        }
      }
    })
  }

  estDispoUpgradeAngel() {
    this.dispoAngel = false;
    this.world.angelupgrades.pallier.forEach(upgA => {
      if (this.dispoAngel == false) {
        if (this.world.activeangels >= upgA.seuil && !upgA.unlocked) {
          this.dispoAngel = true;
        }
      }
    })
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
  //b) Engagement du manager
  achatManager(m: Pallier) {
    //Vérifier que l’argent du joueur est suffisant pour acheter le manager en question
    if (this.world.money >= m.seuil) {
      //Retirer le coût du manager de l’argent possédé par le joueur
      this.world.money = this.world.money - m.seuil;
      //Positionner la propriété unlocked du manager à vrai
      this.world.managers.pallier[this.world.managers.pallier.indexOf(m)].unlocked = true;
      this.world.products.product.forEach(element => {
        //on verifie que l'idcible du manager correspond à l'id d'un produit
        if (m.idcible == element.id) {
          //Positionner la propriété managerUnlocked du manager à vrai
          this.world.products.product[this.world.products.product.indexOf(element)].managerUnlocked = true;
          // this.disponibiliteManager();
          this.service.putManager(m);
          this.notifyService.showSuccess("Achat de " + m.name + " effectué", "Manager")
        }
      });

    }
  }

  achatUpgrade(upg: Pallier) {
    //Vérifier que l’argent du joueur est suffisant pour acheter l'upgrade en question
    if (this.world.money >= upg.seuil) {
      //Retirer le coût de l'upgrade de l’argent possédé par le joueur
      this.world.money = this.world.money - upg.seuil;
      //Positionner la propriété unlocked de l'upgrade à vrai
      this.world.upgrades.pallier[this.world.upgrades.pallier.indexOf(upg)].unlocked = true;
      //On regarde si c'est un upgrade global ou si c'est l'un d'un produit spécifique
      if (upg.idcible == 0) {
        this.productsComponent.forEach(prod => prod.calcUpgrade(upg));
        this.notifyService.showSuccess("achat d'un upgrade de " + upg.typeratio + " pour tous les produits", "Upgrade global");
      }
      else {
        this.productsComponent.forEach(prod => {
          //on verifie que l'idcible de l'upgrade correspond à l'id d'un produit
          if (upg.idcible == prod.product.id) {
            prod.calcUpgrade(upg);
            this.notifyService.showSuccess("achat d'un upgrade de " + upg.typeratio + " pour " + prod.product.name, "Upgrade")
          }
        })
      }
      //signaler l'achat d'un upgrade au serveur 
      this.estDispoUpgrade();
      this.service.putUpgrade(upg);
    }
  }

  achatUpgradeAngel(upgA: Pallier) {
    //Vérifier que les anges du joueur est suffisant pour acheter l'upgrade en question
    if (this.world.activeangels >= upgA.seuil) {
      //Retirer le coût de l'upgrade des anges actifs possédés par le joueur
      this.world.activeangels = this.world.activeangels - upgA.seuil;
      //Positionner la propriété unlocked de l'upgrade à vrai
      this.world.angelupgrades.pallier[this.world.angelupgrades.pallier.indexOf(upgA)].unlocked = true;
      //On regarde si c'est un upgrade global si c'est un upgrade ANGE ou si c'est l'un d'un produit spécifique
      if (upgA.idcible == 0) {
        this.productsComponent.forEach(prod => prod.calcUpgrade(upgA));
        this.notifyService.showSuccess("achat d'un upgrade de " + upgA.typeratio + " pour tous les produits", "Upgrade Angels");
      }
      else if (upgA.idcible == -1) {
        this.world.angelbonus = this.world.angelbonus + upgA.ratio;
        this.notifyService.showSuccess("achat d'un upgrade de " + upgA.typeratio + " pour tous les produits", "Upgrade Angels")
        
      }
      else {
        this.productsComponent.forEach(prod => {
          //on verifie que l'idcible de l'upgrade correspond à l'id d'un produit
          if (upgA.idcible == prod.product.id) {
            prod.calcUpgrade(upgA);
            this.notifyService.showSuccess("achat d'un upgrade de " + upgA.typeratio + " pour " + prod.product.name, "Upgrade Angels")
            
        
          }
        })
      }
      //signaler l'achat d'un upgrade au serveur 
      this.estDispoUpgradeAngel();
    }
  }

  //enregistrement des changements de nom d'utilisateur
  onUsernameChanged(): void {
    localStorage.setItem("username", this.username);
    this.service.setUser(this.username);
  }

  generationpseudo(): void {
    this.username = localStorage.getItem("username");
    if (this.username == null || this.username == '') {
      this.username = 'Joueur' + Math.floor(Math.random() * 10000);
      localStorage.setItem("username", this.username);
    }
    this.service.setUser(this.username);
  }

  bonusAllunlock() {
    //quantité minimale des produits
    let listeProd = this.productsComponent.map(p => p.product.quantite)
    console.log(this.productsComponent);
    let minQuantite = Math.min(...listeProd)
    this.world.allunlocks.pallier.map(value => {
      if (!value.unlocked && minQuantite >= value.seuil) {
        this.world.allunlocks.pallier[this.world.allunlocks.pallier.indexOf(value)].unlocked = true;
        this.productsComponent.forEach(prod => prod.calcUpgrade(value))
        this.notifyService.showSuccess("Bonus de " + value.typeratio + " effectué sur tous les produits", "Unlock");
      }
    })
  }

  //recupération des angels 
  claimAngel(): void {
    this.service.deleteWorld();
  }

  reload() {
    window.location.reload();
  }

} 