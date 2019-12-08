import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
@Component({
  selector: 'app-suggestions',
  templateUrl: './suggestions.component.html',
  styleUrls: ['./suggestions.component.css']
})
export class SuggestionsComponent implements OnInit {
  suggestions=[];
  constructor() { }

  ngOnInit() {
    this.getSuggestions();
  }
  async getSuggestions(){
    this.suggestions = await new Parse.Query('Suggestion').find();
  }
  async delete(suggestion){
    await suggestion.destroy();
    this.getSuggestions();
  }
}
