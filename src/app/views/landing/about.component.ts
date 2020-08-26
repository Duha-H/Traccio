import { Component, OnInit } from "@angular/core";
import { ResizeService } from 'src/app/controllers/resize.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css', './landing.component.css']
})
export class AboutComponent implements OnInit {

  now = new Date();
  timeOfDay = 'morning';
  displayMobileNav = false;

  constructor(public resizeService: ResizeService) { }

  ngOnInit() {
    const hour = this.now.getHours();
    if (hour < 12) {
      this.timeOfDay = 'morning';
    } else if (hour >= 12 && hour < 5) {
      this.timeOfDay = 'afternoon';
    } else {
      this.timeOfDay = 'evening';
    }
  }

  scroll(id: string) {
    const element = document.querySelector(id);
    console.log(element);
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    element.classList.add('pulse');
    setTimeout(() => {
      element.classList.remove('pulse');
    }, 500);
    this.displayMobileNav = false;
  }
}
