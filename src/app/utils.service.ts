import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Parse from 'parse';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private http: HttpClient) { }
  async getAdminACL() {
    const role = await new Parse.Query(Parse.Role).equalTo('name', 'Admin').first();
    const ACL = new Parse.ACL();
    ACL.setPublicReadAccess(true);
    ACL.setWriteAccess(role, true);
    return ACL;
  }
  async getUnsplashRandomImage() {
    return await this.http.get("https://api.unsplash.com/photos/random?orientation=landscape",{headers:{'Authorization':`Client-ID ${environment.unsplash}`}}).toPromise();
  }
}
