import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import {DragDropModule} from '@angular/cdk/drag-drop';

import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { ManagerComponent } from './manager/manager.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ToolsComponent } from './manager/tools/tools.component';
import { ConfirmDialogComponent } from './manager/confirm-dialog/confirm-dialog.component';
import { CategoriesComponent } from './manager/categories/categories.component';
import { SuggestionsComponent } from './manager/suggestions/suggestions.component';
import { SuggestionDialogComponent } from './suggestion-dialog/suggestion-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { AlertDialogComponent } from './manager/alert-dialog/alert-dialog.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    ManagerComponent,
    ToolsComponent,
    ConfirmDialogComponent,
    CategoriesComponent,
    SuggestionsComponent,
    SuggestionDialogComponent,
    AlertDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatToolbarModule,
    MatChipsModule,
    MatIconModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatGridListModule,
    MatCardModule,
    MatProgressBarModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTabsModule,
    MatListModule,
    MatSidenavModule,
    MatDividerModule,
    MatSelectModule,
    MatExpansionModule,
    FlexLayoutModule,
    LayoutModule,
    DragDropModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [LoginComponent, ConfirmDialogComponent, SuggestionDialogComponent, AlertDialogComponent]
})
export class AppModule { }
