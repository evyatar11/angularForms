import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';
import {TokenResponse} from './models/TokenResponse';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  cookie:TokenResponse;
  tokenExists = false;
  constructor(private cookieService:CookieService,private router:Router,private authService:AuthService){}

  ngOnInit(){
    this.cookie = <TokenResponse>this.cookieService.getObject('token');
    if (!this.cookie){
      this.router.navigate(['/login']);
    }
    else{
      this.authService.checkTokenValidity(this.cookie).subscribe(
        (response) => {
          if(!response){
            this.tokenExists=response;
            this.router.navigate(['/login']);
          }
        }
      );
    }
  }

}
