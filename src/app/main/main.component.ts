import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  @ViewChild('category', {static: false}) filterInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: false}) matAutocomplete: MatAutocomplete;
  categories = [{name:"GIT"},{name:"Docker"},{name:"API"},{name:"REST"}];
  filters = [];
  filteredCategories: Observable<any[]>;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  formControl = new FormControl();
  showLoading = false;
  constructor() { 
    this.filteredCategories = this.formControl.valueChanges.pipe(
      startWith(null),
      map((input: any | null) => input ? this._filter(input) : this.categories.slice()));
  }
  private _filter(value): any[] {
    let filterValue = (value.name?value.name:value).toLowerCase();
    return this.categories.filter(category => category.name.toLowerCase().indexOf(filterValue) === 0);
  }
  ngOnInit() {
  }
  filterRemove(filter){
    const index = this.filters.findIndex(i => i.name===filter.name);
    this.filters.splice(index, 1);
  }
  filterSelected(event){
    this.filters.push(event.option.value);
    this.filterInput.nativeElement.value = '';
    this.formControl.setValue(null);
  }
  
}
