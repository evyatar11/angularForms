import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../services/auth.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Auth} from '../models/Auth';
import {TokenResponse} from '../models/TokenResponse';
import {LogService} from '../services/log.service';
import {DialogService} from '../services/dialog.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  auth:Auth;
  signUpGroup: FormGroup;
  constructor(private router: Router,
              private authService:AuthService,
              private logService:LogService,
              private dialogService:DialogService) {}

  ngOnInit() {
    this.signUpGroup = new FormGroup({
      'username': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }

  onLogin(){
    this.auth = new Auth();
    this.auth.username = this.signUpGroup.get('username').value;
    this.auth.password = this.signUpGroup.get('password').value;
    this.authService.authenticateUser(this.auth).subscribe(
      (response) => {
        console.log(response);
        if (response){
          // Open dialog
          this.dialogService.openDialog(
            'Authentication Succeeded',
            'Redirecting to home page',
            'Close',false);
            this.authService.generateTokenForUser(this.auth.username).subscribe(
              (tokenResponse:TokenResponse) => {
                console.log(tokenResponse);
                this.authService.saveTokenInCookie(tokenResponse);
                this.router.navigate(['/']);
              }
            );
          // Log Success
          this.logService.logSuccessfullyLogin(this.auth.username);
        }
        else{
          // Open dialog
          this.dialogService.openDialog(
            'Authentication Failed',
            'The provided credentials were incorrect.\n Please check your username/password and try again',
            'Close',false);
          // Log Failure
          this.logService.logFailedLogin(this.auth.username);

        }
      }
      ,
      (error) => {
        console.log(error);
        // Open dialog
        this.dialogService.openDialog(
          'Error',
          'Something went wrong please try again',
          'Close',false);
      }
    );
  }

}

