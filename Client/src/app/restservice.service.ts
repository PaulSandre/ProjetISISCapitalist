import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { World, Pallier, Product } from './world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {
  constructor(private http: HttpClient) { }
  server = 'http://localhost:8080/';
  user = '';

  public getUser(): string {
    return this.user;
  }
  public setUser(user: string) {
    this.user = user;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getWorld(): Promise<World> {
    return this.http
      .get(this.server + "adventureisis/generic/world", {
        headers: this.setHeaders(this.getUser())
      })
      .toPromise().then(response => response)
      .catch(this.handleError);
  }
   


 

  getServer(): string {
    return this.server;
  }

  putManager(manager: Pallier): Promise<Response> {
    return this.http.put(this.server + "adventureisis/generic/manager", manager, {
      headers: { "X-user": this.getUser() }
    })
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  public putProduit(product: Product): Promise<Response> {
    return this.http
      .put(this.server + "adventureisis/generic/product", product, {
        headers: { "X-user": this.getUser() }
      })
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  public putUpgrade(upgrade: Pallier): Promise<Response> {
    // console.log(upgrade);
     return this.http
       .put(this.server + "adventureisis/generic/upgrade", upgrade, {
         headers: { "X-user": this.getUser() }
       })
       .toPromise()
       .then(response => response)
       .catch(this.handleError);
   }

   public putAngel(angel: Pallier): Promise<Response> {
    // console.log(angel);
     return this.http
       .put(this.server + "adventureisis/generic/upgradeAngel", angel, {
         headers: { "X-user": this.getUser() }
       })
       .toPromise()
       .then(response => response)
       .catch(this.handleError);
   }

   public deleteWorld(): Promise<Response> {
    return this.http
      .delete(this.server + "adventureisis/generic/world", {
        headers: this.setHeaders(this.getUser())
      })
      .toPromise().then(response => response)
      .catch(this.handleError);
  }

  private setHeaders(user: string): HttpHeaders {
    var headers = new HttpHeaders({ 'X-User': user });
    return headers;
  };


}
