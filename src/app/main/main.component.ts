import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { BreakpointObserver } from '@angular/cdk/layout';
import Parse from 'parse';
import { MatDialog } from '@angular/material/dialog';
import { SuggestionDialogComponent } from '../suggestion-dialog/suggestion-dialog.component';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('category', { static: false }) filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  categories = [];
  filteredCategories: Observable<any[]>;
  filter:any = {chips:[]};
  formControl = new FormControl();
  showLoading = false;
  tools = [];
  timer;
  constructor(private breakpointObserver: BreakpointObserver, public dialog:MatDialog) {
    this.filteredCategories = this.formControl.valueChanges.pipe(
      startWith(null),
      map((input: any | null) => input ? this._filter(input) : this.categories.slice()));
  }
  private _filter(value): any[] {
    let filterValue = ((value instanceof Object) ? value.get('name') : value).toLowerCase();
    return this.categories.filter(category => {
      let startWith = category.get('name').toLowerCase().indexOf(filterValue) === 0
      let mappedSelected = this.filter.chips.map((val,i,a) => val.get('name').toLowerCase());
      let alreadySelected = !mappedSelected.includes(category.get('name').toLowerCase())
      return startWith && alreadySelected
    });
  }
  ngOnInit() {
    this.getCategories();
    this.getTools();
  }

  filterRemove(filter) {
    const index = this.filter.chips.findIndex(i => i.get('name') === filter.get('name'));
    this.filter.chips.splice(index, 1);
    this.getTools();
  }
  filterSelected(obj) {
    this.filter.chips.push(obj);
    this.filterInput.nativeElement.value = '';
    this.formControl.setValue(null);
    this.getTools();
  }
  inputChange() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.timer = setTimeout(()=>{this.getTools();}, 1000);
  }
  async getCategories() {
    this.categories = await new Parse.Query('Category').ascending('name').find();
  }
  async getTools() {
    this.showLoading = true;
    let query = new Parse.Query('Tool');
    query.descending("createdAt");
    query.limit(40);
    if (this.filter.name) {
      query.contains('search', this.filter.name.toLowerCase());
    }
    if(this.filter.chips.length>0){
      query.containsAll('categories', this.filter.chips);
    }
    this.tools = await query.find();
    this.showLoading = false;
  }
  open(tool){
    window.open(tool.get("url"), "_blank");
  }
  suggestion(){
    this.dialog.open(SuggestionDialogComponent);
  }
}
