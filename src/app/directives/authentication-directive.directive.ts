import {Directive, OnInit} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';

@Directive({
  selector: '[appAuthentication]'
})
export class AuthenticationDirectiveDirective implements OnInit{

  constructor(private authService: AuthService,private router:Router) { }

  ngOnInit(){
    /* For now, authService only checks if a cookie in the desired token structure exists in the browser, only backend calls
       will validate its real validity. As this directive only applies for router this is enough in this stage
    */
    if (!this.authService.getTokenObject()) {
      this.router.navigate(['/login']);
    }
  }



}
