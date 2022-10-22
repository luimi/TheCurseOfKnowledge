import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css']
})
export class ManagerComponent implements OnInit {
  categories = [];
  constructor() {
    
  }

  ngOnInit() {
    this.getCategories();
  }
  async getCategories() {
    this.categories = await new Parse.Query('Category')
      .limit(1000)
      .ascending('name')
      .find();
  }
  
  
}
