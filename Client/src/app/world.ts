
export class World {
    private _name: string; 
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    private _logo: string;
    public get logo(): string {
        return this._logo;
    }
    public set logo(value: string) {
        this._logo = value;
    }
    private _money: number; 
    public get money(): number {
        return this._money;
    }
    public set money(value: number) {
        this._money = value;
    }
    private _score: number; 
    public get score(): number {
        return this._score;
    }
    public set score(value: number) {
        this._score = value;
    }
    private _totalangels: number;
    public get totalangels(): number {
        return this._totalangels;
    }
    public set totalangels(value: number) {
        this._totalangels = value;
    }
    private _activeangels: number;
    public get activeangels(): number {
        return this._activeangels;
    }
    public set activeangels(value: number) {
        this._activeangels = value;
    }
    private _angelbonus: number;
    public get angelbonus(): number {
        return this._angelbonus;
    }
    public set angelbonus(value: number) {
        this._angelbonus = value;
    }
    private _lastupdate: string; 
    public get lastupdate(): string {
        return this._lastupdate;
    }
    public set lastupdate(value: string) {
        this._lastupdate = value;
    }
    private _products: {
        "product": Product[];
    };
    public get products(): {
        "product": Product[];
    } {
        return this._products;
    }
    public set products(value: {
        "product": Product[];
    }) {
        this._products = value;
    }
    private _allunlocks: {
        "pallier": Pallier[];
    };
    public get allunlocks(): {
        "pallier": Pallier[];
    } {
        return this._allunlocks;
    }
    public set allunlocks(value: {
        "pallier": Pallier[];
    }) {
        this._allunlocks = value;
    }
    private _upgrades: {
        "pallier": Pallier[];
    };
    public get upgrades(): {
        "pallier": Pallier[];
    } {
        return this._upgrades;
    }
    public set upgrades(value: {
        "pallier": Pallier[];
    }) {
        this._upgrades = value;
    }
    private _angelupgrades: {
        "pallier": Pallier[];
    };
    public get angelupgrades(): {
        "pallier": Pallier[];
    } {
        return this._angelupgrades;
    }
    public set angelupgrades(value: {
        "pallier": Pallier[];
    }) {
        this._angelupgrades = value;
    }
    private _managers: {
        "pallier": Pallier[];
    };
    public get managers(): {
        "pallier": Pallier[];
    } {
        return this._managers;
    }
    public set managers(value: {
        "pallier": Pallier[];
    }) {
        this._managers = value;
    }

    constructor() {
        this.products = { "product":[ ] } ;
        this.managers = { "pallier":[ ] };
        this.upgrades = { "pallier":[ ] };
        this.angelupgrades = { "pallier":[ ] };
        this.allunlocks = { "pallier":[ ] };
    }
}

export class Product {
    id : number;
    name : string;
    logo : string;
    cout : number;
    croissance: number;
    revenu: number;
    vitesse: number;
    quantite: number;
    timeleft: number;
    managerUnlocked: boolean;
    palliers : { "pallier" : Pallier[]};

}

export class Pallier {
    name: string;
    logo: string;
    seuil: number;
    idcible: number;
    ratio: number;
    typeratio: string;
    unlocked: boolean;
}
