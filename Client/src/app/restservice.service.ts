import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { World} from './world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {
  constructor(private http: HttpClient) {}
  server = 'http://localhost:8080/';
  user = '';

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  getWorld(): Promise<World> {
    return this.http.get(this.server + 'adventureisis/generic/world')
      .toPromise().catch(this.handleError);
  }

  getServer(): string{
    return this.server;
  }
}
