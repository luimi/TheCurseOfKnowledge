import { Component, OnInit, Input, Output } from '@angular/core';
import Parse from 'parse';
import { EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UtilsService } from 'src/app/utils.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent implements OnInit {
  @Input() categories = [];
  @Output() refresh = new EventEmitter();
  name;
  constructor(public dialog: MatDialog, public utils: UtilsService, private snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  async save() {
    if (!this.name) {
      this.showSnackBar("Debe escribir un nombre");
      return
    }
    if (this.isRegistered(this.name)) {
      this.showSnackBar("Existe una categoria con el mismo nombre");
      return
    }
    const Category = Parse.Object.extend('Category');
    let category = new Category();
    category.set('name', this.name);
    category.setACL(await this.utils.getAdminACL());
    await category.save();
    this.name = undefined;
    this.refresh.emit();
  }

  async delete(category) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { message: 'Do you want to delete this category?' } });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await category.destroy();
        this.refresh.emit();
      }
    });
  }
  isRegistered(text) {
    let category = this.categories.find(category => {
      if (category.get("name").toLowerCase() === text.toLowerCase()) {
        return category;
      }
    });
    return category !== undefined;
  }
  showSnackBar(message) {
    this.snackBar.open(message, null, { duration: 3000 });
  }
}
