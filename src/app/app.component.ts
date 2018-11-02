import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  tokenExists = false;
  constructor(private router:Router,private authService:AuthService){}

  ngOnInit(){
    if (!this.authService.getTokenObject()){
      this.router.navigate(['/login']);
    }
    else{
      this.authService.checkTokenValidity().subscribe(
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
