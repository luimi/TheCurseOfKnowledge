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
  screenLimits = [
    { limit: '(min-width: 320px) and (max-width: 480px)', size: 1 },
    { limit: '(min-width: 481px) and (max-width: 767px)', size: 1 },
    { limit: '(min-width: 768px) and (max-width: 1024px)', size: 2 },
    { limit: '(min-width: 1025px) and (max-width: 1280px)', size: 3 },
    { limit: '(min-width: 1281px)', size: 4 },
  ];
  columnsGrid = 2;
  tools = [];
  timer;
  constructor(private breakpointObserver: BreakpointObserver, public dialog:MatDialog) {
    this.filteredCategories = this.formControl.valueChanges.pipe(
      startWith(null),
      map((input: any | null) => input ? this._filter(input) : this.categories.slice()));
  }
  private _filter(value): any[] {
    let filterValue = ((value instanceof Object) ? value.get('name') : value).toLowerCase();
    return this.categories.filter(category => category.get('name').toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit() {
    this.getColumns();
    this.getCategories();
    this.getTools();
  }

  filterRemove(filter) {
    const index = this.filter.chips.findIndex(i => i.get('name') === filter.get('name'));
    this.filter.chips.splice(index, 1);
    this.getTools();
  }
  filterSelected(event) {
    this.filter.chips.push(event.option.value);
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
  getColumns() {
    for (let i = 0; i < this.screenLimits.length; i++) {
      if (this.breakpointObserver.isMatched(this.screenLimits[i].limit)) {
        this.columnsGrid = this.screenLimits[i].size;
      }
    }
  }
  async getCategories() {
    this.categories = await new Parse.Query('Category').find();
  }
  async getTools() {
    let query = new Parse.Query('Tool');
    query.descending("createdAt");
    if (this.filter.name) {
      query.contains('search', this.filter.name.toLowerCase());
    }
    if(this.filter.chips.length>0){
      query.containsAll('categories', this.filter.chips);
    }
    this.tools = await query.find();
  }
  open(tool){
    window.open(tool.get("url"), "_blank");
  }
  suggestion(){
    this.dialog.open(SuggestionDialogComponent);
  }
}
