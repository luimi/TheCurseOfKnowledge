import { Component, OnInit, Inject } from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import Parse from 'parse';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  auth:any = {};
  
  constructor(public dialogRef: MatDialogRef<LoginComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar) { 
    }
    async login(){
      if(this.auth.user && this.auth.pass){
        try{
          await Parse.User.logIn(this.auth.user, this.auth.pass);
          this.dialogRef.close();
        }catch(e){
          this.snackBar.open("Username or Password is invalid","Dismiss", {  duration: 3000, });
        }
      }
    }

}
