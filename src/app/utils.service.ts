import { Injectable } from '@angular/core';
import Parse from 'parse';
@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() { }
  async getAdminACL() {
    const role = await new Parse.Query(Parse.Role).equalTo('name', 'Admin').first();
    const ACL = new Parse.ACL();
    ACL.setPublicReadAccess(true);
    ACL.setWriteAccess(role, true);
    return ACL;
  }
}
