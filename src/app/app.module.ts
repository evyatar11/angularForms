import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';

import {
  MatGridListModule, MatToolbarModule,
  MatIconModule, MatFormFieldModule,
  MatSelectModule, MatStepperModule,
  MatTabsModule, MatCardModule, MatInputModule,
  MatTableModule, MatDialog, MatDialogModule,
  MatRadioModule,MatCheckboxModule
} from '@angular/material';


import { AppComponent } from './app.component';
import { QuestionnaireComponent } from './home/questionnaire/questionnaire.component';
import { LgdComponent } from './home/lgd/lgd.component';
import { DetailsComponent } from './home/questionnaire/details/details.component';
import { TabComponent } from './home/questionnaire/tab/tab.component';
import { TableComponent } from './home/questionnaire/table/table.component';
import { GraphComponent } from './home/questionnaire/graph/graph.component';
import { HomeComponent } from './home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { CookieModule } from 'ngx-cookie';
import { SignupComponent } from './signup/signup.component';
import {AuthService} from './services/auth.service';
import {FormService} from './services/form.service';
import {HttpModule} from '@angular/http';
import {LogService} from './services/log.service';
import {DialogService} from './services/dialog.service';
import { DialogComponent } from './dialog/dialog.component';
import {DialogdataService} from './services/dialogdata.service';

const appRoutes: Routes  = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'questionnaire', component: QuestionnaireComponent },
  { path: 'lgd', component: LgdComponent },
  { path: '**', component: HomeComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    QuestionnaireComponent,
    LgdComponent,
    DetailsComponent,
    TabComponent,
    TableComponent,
    GraphComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ReactiveFormsModule,
    MatGridListModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatStepperModule,
    MatTabsModule,
    MatInputModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatRadioModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    CookieModule.forRoot(),
    HttpModule

  ],
  providers: [FormService,AuthService,LogService,DialogService,DialogdataService],
  bootstrap: [AppComponent],
  entryComponents: [DialogComponent]
})
export class AppModule { }
