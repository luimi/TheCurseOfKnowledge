import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Router } from '@angular/router';
import Parse from 'parse';
import { LoginComponent } from './login/login.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'TheCurseOfKnowledge';
  isLogedIn = false;
  constructor(public dialog: MatDialog, private router: Router){
    Parse.initialize("tCbO3YhTW1fNFp6tC6rIy2IqR1dL6unVs4NsDx7Q", 
    "ZRTekpfa2Aacehyd2c3AVsMZNirugnTGI7DDaV7O");
    Parse.serverURL = 'https://parseapi.back4app.com/';
    this.isLogedIn = Parse.User.current()!=undefined;
  }
  login(){
    const dialogRef = this.dialog.open(LoginComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.isLogedIn = Parse.User.current()!=undefined;
    });
  }
  async logout(){
    await Parse.User.logOut();
    this.isLogedIn = Parse.User.current()!=undefined;
    this.router.navigateByUrl("/");
  }
  github(){
    window.open("https://github.com/luimi/TheCurseOfKnowledge", "_blank");
  }
  lui2mi(){
    window.open("https://lui2mi.wordpress.com/", "_blank");
  }
}
