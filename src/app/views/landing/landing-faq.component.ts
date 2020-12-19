import { Component, OnInit } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ResizeService } from 'src/app/controllers/resize.service';
import { SECTIONED_FAQS } from 'src/app/shared-components/faqs/faq';

@Component({
  selector: 'app-landing-faq',
  templateUrl: 'landing-faq.component.html',
  styleUrls: ['landing-views.css'],
})
export class LandingFAQComponent implements OnInit {

  faqSections = SECTIONED_FAQS;

  constructor(public rs: ResizeService, private titleService: Title) { }

  ngOnInit() {
    this.titleService.setTitle('FAQ | Traccio');
  }

}
