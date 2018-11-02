import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  navigatedOut=false;
  constructor(private router:Router){}

  onTileClicked(path){
    this.router.navigate(['/'+path]);
    this.navigatedOut=true;
  }

  ngOnInit() {
  }

}
