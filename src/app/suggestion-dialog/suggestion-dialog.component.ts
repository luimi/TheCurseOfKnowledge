import { Component, OnInit } from '@angular/core';
import Parse from 'parse';
import { UtilsService } from '../utils.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-suggestion-dialog',
  templateUrl: './suggestion-dialog.component.html',
  styleUrls: ['./suggestion-dialog.component.css']
})
export class SuggestionDialogComponent implements OnInit {
  content;
  constructor(public dialogRef: MatDialogRef<SuggestionDialogComponent>,public util:UtilsService) { }

  ngOnInit() {
  }
  async send(){
    if(this.content){
      const Suggestion = Parse.Object.extend("Suggestion");
      let suggestion = new Suggestion();
      suggestion.set("content",this.content);
      suggestion.setACL(await this.util.getAdminACL());
      await suggestion.save();
      this.dialogRef.close();
    }
  }
}
