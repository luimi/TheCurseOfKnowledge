import { Component, OnInit, Input, Output } from '@angular/core';
import Parse from 'parse';
import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UtilsService } from 'src/app/utils.service';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  @Input() categories = [];
  @Output() refresh = new EventEmitter();
  name;
  constructor(public dialog: MatDialog, public utils: UtilsService) { }

  ngOnInit() {
  }
  async save(){
    if(this.name){
      const Category = Parse.Object.extend('Category');
      let category = new Category();
      category.set('name',this.name);
      category.setACL(await this.utils.getAdminACL());
      await category.save();
      this.name = undefined;
      this.refresh.emit();
    }
  }
  async delete(category){
    const dialogRef = this.dialog.open(ConfirmDialogComponent,{data:{message:'Do you want to delete this category?'}});
    dialogRef.afterClosed().subscribe( async result => {
      if(result){
        await category.destroy();
        this.refresh.emit();
      }
    });
  }
}
