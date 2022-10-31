import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { BreakpointObserver } from '@angular/cdk/layout';
import Parse from 'parse';
import { MatDialog } from '@angular/material/dialog';
import { SuggestionDialogComponent } from '../suggestion-dialog/suggestion-dialog.component';
import { UtilsService } from '../utils.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  @ViewChild('category', { static: false }) filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', { static: false }) matAutocomplete: MatAutocomplete;
  @ViewChild('filterType', { static: false }) filterType;
  categories = [];
  filteredCategories: Observable<any[]>;
  filter:any = {chips:[]};
  formControl = new FormControl();
  showLoading = false;
  tools = [];
  timer;
  background;
  constructor(private breakpointObserver: BreakpointObserver, public dialog:MatDialog, private utils: UtilsService) {
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
    this.categories = await new Parse.Query('Category').limit(1000).ascending('name').find();
  }
  async getTools() {
    if(this.filterType) console.log(this.filterType.value);
    this.showLoading = true;
    let query = new Parse.Query('Tool');
    query.descending("createdAt");
    query.limit(40);
    if(this.filterType && this.filterType.value==='category' && this.filter.chips.length>0){
      query.containsAll('categories', this.filter.chips);
    } else if(this.filterType && this.filterType.value==='name' && this.filter.name) {
      query.contains('search', this.filter.name.toLowerCase());
    }
    this.tools = await query.find();
    this.showLoading = false;
  }
  async open(tool){
    window.open(tool.get("url"), "_blank");
    await Parse.Cloud.run("addView", { "id": tool.id });
  }
  suggestion(){
    this.dialog.open(SuggestionDialogComponent);
  }
}
