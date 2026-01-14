import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import Parse from 'parse';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { UtilsService } from 'src/app/utils.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {
  @ViewChild('category', { static: false }) filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @Input() categories = [];
  tools = [];
  timer;

  filteredCategories: Observable<any[]>;
  filter: any = { name: '', chips: [] };
  formControl = new FormControl();
  currentTool: any = {};
  plans = ["Free", "paid", "Freemium", "Trial"];
  constructor(public dialog: MatDialog, public utils: UtilsService) {
    this.filteredCategories = this.formControl.valueChanges.pipe(
      startWith(null),
      map((input: any | null) => input ? this._filter(input) : this.categories.slice()));
  }

  ngOnInit() {
    this.search();
    this.newTool();
  }
  async search() {
    const query = new Parse.Query('Tool');
    query.limit(10);
    query.descending("createdAt");
    if (this.filter.name) {
      query.contains('search', this.filter.name.toLowerCase());
    }
    this.tools = await query.find();
  }
  searchChange() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(() => { this.search(); }, 1000);
  }
  filterRemove(filter) {
    const index = this.currentTool.categories.findIndex(i => i.get('name') === filter.get('name'));
    this.currentTool.categories.splice(index, 1);
  }
  filterSelected(event) {
    this.currentTool.categories.push(event.option.value);
    this.filterInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }
  private _filter(value): any[] {
    let filterValue = ((value instanceof Object) ? value.get('name') : value).toLowerCase();
    return this.categories.filter(category => {
      let startWith = category.get('name').toLowerCase().indexOf(filterValue) === 0
      let mappedSelected = this.currentTool.categories.map((val, i, a) => val.get('name').toLowerCase());
      let alreadySelected = !mappedSelected.includes(category.get('name').toLowerCase())
      return startWith && alreadySelected
    });
  }
  edit(tool) {
    this.newTool();
    this.currentTool.name = tool.get('name');
    this.currentTool.url = tool.get('url');
    this.currentTool.categories = tool.get('categories');
    this.currentTool.plan = tool.get('plan');
    this.currentTool.saved = tool;
  }
  newTool() {
    this.currentTool = { categories: [] };
  }
  async save() {
    const { name, url, categories, plan, saved } = this.currentTool
    if (!name || !url || categories.length === 0 || !plan) {
      this.dialog.open(AlertDialogComponent, {data: {message : 'All data is required'}})
      return
    }
    let tool;
    if (saved) {
      tool = saved;
    } else {
      const exists = await new Parse.Query("Tool").equalTo("search", name.toLowerCase()).first();
      if(exists) {
        this.dialog.open(AlertDialogComponent, {data: {message : 'A tool with this name alredy exists'}})
        return
      }
      const Tool = Parse.Object.extend('Tool');
      tool = new Tool();
      tool.setACL(await this.utils.getAdminACL());
    }
    tool.set("name", name);
    tool.set("search", name.toLowerCase());
    tool.set("url", url);
    tool.set("categories", categories);
    tool.set("plan", plan);
    //this.currentTool.saved.set("name",this.currentTool.name);
    await tool.save();
    this.newTool();
    this.search();
  }
  delete(tool) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, { data: { message: 'Do you want to delete this tool?' } });
    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await tool.destroy();
        this.search();
      }
    });
  }
  swap(evt) {
    moveItemInArray(this.currentTool.categories, evt.previousIndex, evt.currentIndex);
    console.log(evt);
  }
}
